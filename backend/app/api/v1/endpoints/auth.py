from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from backend.app.services.user_service import UserService
from backend.app.api.deps import get_user_service, get_current_user
from backend.app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, service: UserService = Depends(get_user_service)):
    return await service.register_user(user_in)

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, service: UserService = Depends(get_user_service)):
    access_token, refresh_token = await service.authenticate(login_data)
    return {"access_token": access_token, "refresh_token": refresh_token}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
