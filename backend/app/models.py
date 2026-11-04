import enum  
import uuid  
from datetime import datetime, timezone  

from sqlalchemy import Boolean, DateTime, Enum, String 
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