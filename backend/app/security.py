import hashlib  
import hmac  
import secrets 
from datetime import datetime, timedelta, timezone  

import jwt  

from app.config import settings  


def generate_code() -> str:  
    return f"{secrets.randbelow(10**6):06d}" 


def hash_code(code: str) -> str:  
    return hmac.new(settings.secret_key.encode(), code.encode(), hashlib.sha256).hexdigest()  


def create_access_token(user_id: str) -> str:  
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(minutes=30)}  
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")  