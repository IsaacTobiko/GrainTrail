import hmac
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Otp, User
from app.schemas import PhoneIn, SignupIn, TokenOut, UserOut, VerifyIn
from app.security import create_access_token, generate_code, hash_code

router = APIRouter(prefix="/auth", tags=["auth"])


def send_otp(db: Session, phone: str) -> None:
    window = datetime.now(timezone.utc) - timedelta(minutes=10)
    recent = db.scalar(
        select(func.count())
        .select_from(Otp)
        .where(Otp.phone == phone, Otp.created_at > window)
    )
    if recent >= 3:
        raise HTTPException(
            status_code=429,
            detail="Too many codes requested. Try again in a few minutes.",
        )
    code = generate_code()
    db.add(
        Otp(
            phone=phone,
            code_hash=hash_code(code),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=5),
        )
    )
    db.commit()
    print(f"OTP for {phone}: {code}")


@router.post("/signup", status_code=201)
def signup(data: SignupIn, db: Session = Depends(get_db)):
    if db.scalar(select(User).where(User.phone == data.phone)):
        raise HTTPException(status_code=409, detail="Phone already registered")
    db.add(
        User(
            first_name=data.first_name,
            last_name=data.last_name,
            phone=data.phone,
            role=data.role,
        )
    )
    db.commit()
    send_otp(db, data.phone)
    return {"message": "Code sent"}


@router.post("/login")
def login(data: PhoneIn, db: Session = Depends(get_db)):
    if not db.scalar(select(User).where(User.phone == data.phone)):
        raise HTTPException(status_code=404, detail="Number not registered")
    send_otp(db, data.phone)
    return {"message": "Code sent"}


@router.post("/verify-otp", response_model=TokenOut)
def verify_otp(data: VerifyIn, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    otp = db.scalar(
        select(Otp)
        .where(Otp.phone == data.phone, Otp.used.is_(False), Otp.expires_at > now)
        .order_by(Otp.expires_at.desc())
    )
    if not otp:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    if not hmac.compare_digest(otp.code_hash, hash_code(data.code)):
        otp.attempts += 1
        if otp.attempts >= 5:
            otp.used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    otp.used = True
    user = db.scalar(select(User).where(User.phone == data.phone))
    user.is_verified = True
    db.commit()
    return TokenOut(access_token=create_access_token(str(user.id)))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user