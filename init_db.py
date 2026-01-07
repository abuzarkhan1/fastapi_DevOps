import asyncio
import sys
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# valid credentials discovered: root:root
DB_URL = "mysql+aiomysql://root:root@localhost:3306"
DB_NAME = "management_db"

async def init_db():
    print(f"Connecting to MySQL to create database '{DB_NAME}'...")
    try:
        # Connect to server without selecting a DB
        engine = create_async_engine(DB_URL)
        async with engine.connect() as conn:
            await conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}"))
            await conn.commit()
        print(f"SUCCESS: Database '{DB_NAME}' created or already exists!")
    except Exception as e:
        print(f"FAILURE: {str(e)}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(init_db())
