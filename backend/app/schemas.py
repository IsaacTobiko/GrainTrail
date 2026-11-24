import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.models import DealStatus, LoadStatus, Role

PHONE_PATTERN = r"^\+(254|255)\d{9}$"


class SignupIn(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    phone: str = Field(pattern=PHONE_PATTERN)
    role: Role


class PhoneIn(BaseModel):
    phone: str = Field(pattern=PHONE_PATTERN)


class VerifyIn(BaseModel):
    phone: str = Field(pattern=PHONE_PATTERN)
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


class PartyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    first_name: str
    last_name: str


class AddPartyIn(BaseModel):
    party: Literal["seller", "buyer"]
    phone: str = Field(pattern=PHONE_PATTERN)


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
    seller: PartyOut | None = None
    buyer: PartyOut | None = None

class LoadCreate(BaseModel):
    plate_number: str = Field(min_length=3, max_length=20)
    bags: int = Field(gt=0)
    transporter_phone: str | None = Field(default=None, pattern=PHONE_PATTERN)


class LoadStatusUpdate(BaseModel):
    status: LoadStatus


class LoadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    deal_id: uuid.UUID
    plate_number: str
    bags: int
    status: LoadStatus
    created_at: datetime
    transporter: PartyOut | None = None