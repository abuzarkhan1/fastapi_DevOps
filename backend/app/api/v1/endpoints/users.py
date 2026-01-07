from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.schemas.user import UserResponse, UserUpdate, UserCreate
from backend.app.services.user_service import UserService
from backend.app.api.deps import get_user_service, get_current_user, RoleChecker
from backend.app.models.user import User, UserRole

router = APIRouter()

# Dependencies
check_admin = RoleChecker([UserRole.ADMIN])

@router.get("/", response_model=List[UserResponse], dependencies=[Depends(check_admin)])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    service: UserService = Depends(get_user_service)
):
    """
    Retrieve users. Only for Admins.
    """
    return await service.get_users(skip=skip, limit=limit)

@router.post("/", response_model=UserResponse, dependencies=[Depends(check_admin)])
async def create_user(
    user_in: UserCreate,
    service: UserService = Depends(get_user_service)
):
    """
    Create a new user. Only for Admins.
    """
    return await service.register_user(user_in)

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    """
    Get a specific user by id.
    """
    if current_user.id != user_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return await service.get_user_by_id(user_id)

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    """
    Update a user.
    """
    if current_user.id != user_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # If standard user tries to change role, forbid it
    if current_user.role != UserRole.ADMIN and user_in.role is not None:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot change your own role"
        )
         
    return await service.update_user(user_id, user_in.model_dump(exclude_unset=True))

@router.delete("/{user_id}", response_model=UserResponse, dependencies=[Depends(check_admin)])
async def delete_user(
    user_id: int,
    service: UserService = Depends(get_user_service)
):
    """
    Delete a user. Only for Admins.
    """
    return await service.delete_user(user_id)
