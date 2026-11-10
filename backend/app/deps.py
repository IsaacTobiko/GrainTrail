import uuid  

from fastapi import Depends, HTTPException  
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer  
from sqlalchemy.orm import Session  

from app.database import get_db  
from app.models import User  
from app.security import decode_access_token 

bearer = HTTPBearer()  


def get_current_user(  
    creds: HTTPAuthorizationCredentials = Depends(bearer), 
    db: Session = Depends(get_db),  
) -> User:
    user_id = decode_access_token(creds.credentials)  
    if not user_id: 
        raise HTTPException(status_code=401, detail="Invalid or expired token")  
    user = db.get(User, uuid.UUID(user_id))  
    if not user:  
        raise HTTPException(status_code=401, detail="User not found")  
    return user  