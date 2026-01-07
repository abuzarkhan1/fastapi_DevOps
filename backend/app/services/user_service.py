from datetime import datetime
from typing import Optional, Tuple
from fastapi import HTTPException, status
from app.db.user_repository import UserRepository
from app.schemas.user import UserCreate, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.models.user import User

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register_user(self, user_in: UserCreate) -> User:
        user = await self.user_repo.get_by_email(user_in.email)
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists",
            )
        
        user_data = user_in.model_dump()
        # Auto-generate username from email since we removed the field
        user_data["username"] = user_in.email
        password = user_data.pop("password")
        user_data["hashed_password"] = get_password_hash(password)
        
        return await self.user_repo.create(user_data)

    async def authenticate(self, login_data: UserLogin) -> Tuple[str, str]:
        user = await self.user_repo.get_by_email(login_data.email)
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Inactive user",
            )
        
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        return access_token, refresh_token

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        return await self.user_repo.get(user_id)

    async def get_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        return await self.user_repo.get_multi(skip=skip, limit=limit)

    async def update_user(self, user_id: int, user_update: dict) -> User:
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        if "password" in user_update and user_update["password"]:
            user_update["hashed_password"] = get_password_hash(user_update.pop("password"))
        
        return await self.user_repo.update(user, user_update)

    async def delete_user(self, user_id: int) -> User:
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return await self.user_repo.remove(user_id)
