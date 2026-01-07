import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Add the parent directory to sys.path to ensure modules can be imported
sys.path.append(os.getcwd())

from backend.app.core.config import settings

async def check_db():
    # List of credentials to try
    configs = [
        (settings.DATABASE_URL, "Configured URL"),
        (f"mysql+aiomysql://root:@{settings.MYSQL_SERVER}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}", "Root (No Pass)"),
        (f"mysql+aiomysql://root:root@{settings.MYSQL_SERVER}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}", "Root (root)"),
        (f"mysql+aiomysql://root:password@{settings.MYSQL_SERVER}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}", "Root (password)"),
    ]

    for url, label in configs:
        print(f"\nTesting {label}: {url}")
        try:
            engine = create_async_engine(url)
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            print(f"SUCCESS: Database connection established using {label}!")
            return
        except Exception as e:
            print(f"FAILURE ({label}): {str(e)}")
            
    print("\nALL ATTEMPTS FAILED. Please verify your MySQL service is running and credentials are correct.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_db())
