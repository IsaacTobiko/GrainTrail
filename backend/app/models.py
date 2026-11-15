import enum  
import uuid  
from datetime import datetime, timezone  

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String, func 
from sqlalchemy.dialects.postgresql import UUID  
from sqlalchemy.orm import Mapped, mapped_column  

from app.database import Base  


class Role(str, enum.Enum):  
    broker = "broker"  
    buyer = "buyer" 
    seller = "seller"  
    transporter = "transporter"  


class User(Base):  
    __tablename__ = "users"  

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  
    first_name: Mapped[str] = mapped_column(String(80))  
    last_name: Mapped[str] = mapped_column(String(80)) 
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True) 
    role: Mapped[Role] = mapped_column(Enum(Role)) 
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)  
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))  

class Otp(Base):  
    __tablename__ = "otps"  

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  
    phone: Mapped[str] = mapped_column(String(20), index=True) 
    code_hash: Mapped[str] = mapped_column(String(64)) 
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))  
    used: Mapped[bool] = mapped_column(Boolean, default=False)  
    attempts: Mapped[int] = mapped_column(Integer, default=0, server_default="0")  
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), server_default=func.now()) 

class DealStatus(str, enum.Enum):  
    negotiating = "negotiating"  
    agreed = "agreed"  
    in_transit = "in_transit"  
    delivered = "delivered"  
    paid = "paid"  
    cancelled = "cancelled"  


class LoadStatus(str, enum.Enum):  
    pending = "pending" 
    loaded = "loaded"  
    in_transit = "in_transit"  
    delivered = "delivered"  


class Deal(Base):  
    __tablename__ = "deals"  

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  
    broker_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)  
    seller_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)  
    buyer_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True) 
    maize_type: Mapped[str] = mapped_column(String(40))  
    quantity_bags: Mapped[int] = mapped_column(Integer)  
    price_per_bag: Mapped[float] = mapped_column(Numeric(12, 2))  
    status: Mapped[DealStatus] = mapped_column(Enum(DealStatus), default=DealStatus.negotiating)  
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))  
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))  


class Load(Base):  
    __tablename__ = "loads"  

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  
    deal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("deals.id"), index=True)  
    transporter_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)  
    plate_number: Mapped[str] = mapped_column(String(20))  
    bags: Mapped[int] = mapped_column(Integer)  
    status: Mapped[LoadStatus] = mapped_column(Enum(LoadStatus), default=LoadStatus.pending)  
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))  