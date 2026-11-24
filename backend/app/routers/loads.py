import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Deal, DealStatus, Load, LoadStatus, Role, User
from app.routers.deals import get_deal_for_user
from app.schemas import LoadCreate, LoadOut, LoadStatusUpdate

router = APIRouter(tags=["loads"])

LOAD_NEXT = {
    LoadStatus.ordered: {LoadStatus.loading, LoadStatus.stopped},
    LoadStatus.loading: {LoadStatus.weighed, LoadStatus.stopped},
    LoadStatus.weighed: {LoadStatus.cleared, LoadStatus.stopped},
    LoadStatus.cleared: {LoadStatus.in_transit, LoadStatus.stopped},
    LoadStatus.in_transit: {LoadStatus.delivered, LoadStatus.stopped},
    LoadStatus.delivered: {LoadStatus.closed},
    LoadStatus.closed: set(),
    LoadStatus.stopped: {
        LoadStatus.loading,
        LoadStatus.weighed,
        LoadStatus.cleared,
        LoadStatus.in_transit,
    },
}

TRANSPORTER_MOVES = {LoadStatus.in_transit, LoadStatus.delivered, LoadStatus.stopped}


@router.post("/deals/{deal_id}/loads", response_model=LoadOut, status_code=201)
def create_load(
    deal_id: uuid.UUID,
    data: LoadCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deal = get_deal_for_user(db, deal_id, user)
    if deal.broker_id != user.id:
        raise HTTPException(status_code=403, detail="Only the broker can add loads")
    if deal.status not in (DealStatus.agreed, DealStatus.in_transit):
        raise HTTPException(
            status_code=400,
            detail="Loads can only be added to an agreed or in transit deal",
        )
    used = db.scalar(
        select(func.coalesce(func.sum(Load.bags), 0)).where(Load.deal_id == deal.id)
    )
    if used + data.bags > deal.quantity_bags:
        raise HTTPException(
            status_code=400,
            detail=f"Only {deal.quantity_bags - used} bags left on this deal",
        )
    transporter_id = None
    if data.transporter_phone:
        transporter = db.scalar(
            select(User).where(
                User.phone == data.transporter_phone, User.role == Role.transporter
            )
        )
        if not transporter:
            raise HTTPException(
                status_code=404, detail="No registered transporter with that number"
            )
        transporter_id = transporter.id
    load = Load(
        deal_id=deal.id,
        transporter_id=transporter_id,
        plate_number=data.plate_number.strip().upper(),
        bags=data.bags,
    )
    db.add(load)
    db.commit()
    db.refresh(load)
    return load


@router.get("/deals/{deal_id}/loads", response_model=list[LoadOut])
def list_loads(
    deal_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deal = get_deal_for_user(db, deal_id, user)
    query = select(Load).where(Load.deal_id == deal.id).order_by(Load.created_at)
    return db.scalars(query).all()


@router.get("/loads/mine", response_model=list[LoadOut])
def my_loads(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != Role.transporter:
        raise HTTPException(
            status_code=403, detail="Only transporters have assigned loads"
        )
    query = (
        select(Load)
        .where(Load.transporter_id == user.id)
        .order_by(Load.created_at.desc())
    )
    return db.scalars(query).all()


@router.patch("/loads/{load_id}/status", response_model=LoadOut)
def update_load_status(
    load_id: uuid.UUID,
    data: LoadStatusUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    load = db.get(Load, load_id)
    deal = db.get(Deal, load.deal_id) if load else None
    is_broker = deal is not None and deal.broker_id == user.id
    is_transporter = load is not None and load.transporter_id == user.id
    if not load or not (is_broker or is_transporter):
        raise HTTPException(status_code=404, detail="Load not found")
    if data.status not in LOAD_NEXT[load.status]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot move from {load.status.value} to {data.status.value}",
        )
    if not is_broker and (
        data.status not in TRANSPORTER_MOVES or load.status == LoadStatus.stopped
    ):
        raise HTTPException(
            status_code=403, detail="Only the broker can make that change"
        )
    load.status = data.status
    db.commit()
    db.refresh(load)
    return load