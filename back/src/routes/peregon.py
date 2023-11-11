import os

from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from .schemas import PeregonsResponse, Peregon

peregon_api_router = APIRouter()


@peregon_api_router.get("/api/v1/peregons", response_model=PeregonsResponse)
async def get_table_calendar(
) -> PeregonsResponse:
    query = text("""
        select
            id,
            from_station_id,
            to_station_id,
            len_km
        from peregon;
    """)

    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        result = await session.execute(
            query,
        )
        peregons = [Peregon(
            id=rec.id,
            from_station_id=rec.from_station_id,
            to_station_id=rec.from_station_id,
            len_km=rec.len_km,
        ) for rec in result.all()]

    return PeregonsResponse(
        peregons=peregons,
        filters=None,
    )
