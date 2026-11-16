import uuid  
from datetime import datetime  
from decimal import Decimal 

from pydantic import BaseModel, ConfigDict, Field  

from app.models import DealStatus, Role  


class SignupIn(BaseModel):  
    first_name: str = Field(min_length=1, max_length=80)  
    last_name: str = Field(min_length=1, max_length=80)  
    phone: str = Field(min_length=9, max_length=20)  
    role: Role  


class PhoneIn(BaseModel):  
    phone: str = Field(min_length=9, max_length=20)  

class VerifyIn(BaseModel):  
    phone: str = Field(min_length=9, max_length=20)  
    code: str = Field(min_length=6, max_length=6)  


class TokenOut(BaseModel):  
    access_token: str  
    token_type: str = "bearer"  

class UserOut(BaseModel):  
    model_config = ConfigDict(from_attributes=True) 

    id: uuid.UUID  
    first_name: str  
    last_name: str 
    phone: str  
    role: Role 
    is_verified: bool 

class DealCreate(BaseModel):  
    maize_type: str = Field(min_length=1, max_length=40)  
    quantity_bags: int = Field(gt=0)  
    price_per_bag: Decimal = Field(gt=0, max_digits=12, decimal_places=2)  


class DealStatusUpdate(BaseModel):  
    status: DealStatus  


class DealOut(BaseModel):  
    model_config = ConfigDict(from_attributes=True)  

    id: uuid.UUID  
    broker_id: uuid.UUID  
    maize_type: str 
    quantity_bags: int  
    price_per_bag: Decimal  
    status: DealStatus  
    created_at: datetime  
    updated_at: datetime  