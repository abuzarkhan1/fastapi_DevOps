import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Add parent directory to path
sys.path.append(os.getcwd())

from backend.app.core.config import settings

async def promote_user(email: str):
    print(f"Promoting user {email} to admin...")
    try:
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            # Check if user exists
            result = await conn.execute(text("SELECT id FROM users WHERE email = :email"), {"email": email})
            user = result.first()
            if not user:
                print(f"User {email} not found.")
                return

            # Update role
            await conn.execute(
                text("UPDATE users SET role = 'admin' WHERE email = :email"),
                {"email": email}
            )
        print(f"SUCCESS: User {email} is now an admin!")
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_user.py <email>")
        sys.exit(1)
    
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    # Run the promotion
    asyncio.run(promote_user(sys.argv[1]))
