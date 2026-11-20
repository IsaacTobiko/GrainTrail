import uuid 

from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy import or_, select  
from sqlalchemy.orm import Session  

from app.database import get_db  
from app.deps import get_current_user  
from app.models import Deal, DealStatus, Role, User 
from app.schemas import AddPartyIn, DealCreate, DealOut, DealStatusUpdate  

router = APIRouter(prefix="/deals", tags=["deals"])  

ALLOWED_NEXT = {  
    DealStatus.negotiating: {DealStatus.agreed, DealStatus.cancelled},  
    DealStatus.agreed: {DealStatus.in_transit, DealStatus.cancelled},  
    DealStatus.in_transit: {DealStatus.delivered},  
    DealStatus.delivered: {DealStatus.paid}, 
    DealStatus.paid: set(),  
    DealStatus.cancelled: set(),  
}


def get_deal_for_user(db: Session, deal_id: uuid.UUID, user: User) -> Deal:  
    deal = db.get(Deal, deal_id)  
    if not deal or user.id not in (deal.broker_id, deal.seller_id, deal.buyer_id): 
        raise HTTPException(status_code=404, detail="Deal not found")  
    return deal  


@router.post("", response_model=DealOut, status_code=201) 
def create_deal(data: DealCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):  
    if user.role != Role.broker:  
        raise HTTPException(status_code=403, detail="Only brokers can create deals")  
    deal = Deal(  
        broker_id=user.id,  
        maize_type=data.maize_type,  
        quantity_bags=data.quantity_bags,  
        price_per_bag=data.price_per_bag,  
    )
    db.add(deal)  
    db.commit()  
    db.refresh(deal)  
    return deal 


@router.get("", response_model=list[DealOut])  
def list_deals(user: User = Depends(get_current_user), db: Session = Depends(get_db)):  
    query = (  
        select(Deal)
        .where(or_(Deal.broker_id == user.id, Deal.seller_id == user.id, Deal.buyer_id == user.id))  
        .order_by(Deal.created_at.desc())  
    )
    return db.scalars(query).all()  

@router.get("/{deal_id}", response_model=DealOut)  
def get_deal(deal_id: uuid.UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)):  
    return get_deal_for_user(db, deal_id, user) 


@router.patch("/{deal_id}/status", response_model=DealOut)  
def update_status(deal_id: uuid.UUID, data: DealStatusUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):  
    deal = get_deal_for_user(db, deal_id, user)  
    if deal.broker_id != user.id:  
        raise HTTPException(status_code=403, detail="Only the broker can change the status")  
    if data.status not in ALLOWED_NEXT[deal.status]:  
        raise HTTPException(status_code=400, detail=f"Cannot move from {deal.status.value} to {data.status.value}")  
    deal.status = data.status  
    db.commit()  
    db.refresh(deal)  
    return deal  

@router.post("/{deal_id}/parties", response_model=DealOut) 
def add_party(deal_id: uuid.UUID, data: AddPartyIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):  
    deal = get_deal_for_user(db, deal_id, user)  
    if deal.broker_id != user.id:  
        raise HTTPException(status_code=403, detail="Only the broker can add people to a deal")  
    wanted = Role.seller if data.party == "seller" else Role.buyer  
    person = db.scalar(select(User).where(User.phone == data.phone, User.role == wanted))  
    if not person:  
        raise HTTPException(status_code=404, detail=f"No registered {data.party} with that number")  
    if data.party == "seller": 
        deal.seller_id = person.id  
    else:  
        deal.buyer_id = person.id  
    db.commit()  
    db.refresh(deal) 
    return deal 