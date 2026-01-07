import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine

# Add parent directory to path
sys.path.append(os.getcwd())

from backend.app.core.config import settings
from backend.app.db.repository import Base
# Import models so they are registered with Base
from backend.app.models.user import User

async def init_tables():
    print(f"Creating tables in {settings.MYSQL_DB}...")
    try:
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("SUCCESS: Tables created successfully!")
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(init_tables())
