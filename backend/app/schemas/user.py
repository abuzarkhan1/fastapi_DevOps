from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from backend.app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr

    full_name: Optional[str] = None
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
