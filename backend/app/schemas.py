from pydantic import BaseModel, Field  

from app.models import Role  


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