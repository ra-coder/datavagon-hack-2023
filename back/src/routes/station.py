import os

from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from .schemas import StationsResponse, Station

station_api_router = APIRouter()


@station_api_router.get("/api/v1/stations", response_model=StationsResponse)
async def get_table_calendar(
) -> StationsResponse:
    query = text("""
        select
            id,
            name,
            latitude,
            longitude
        from station;
    """)

    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        result = await session.execute(
            query,
        )
        stations = [Station(
            id=rec.id,
            name=rec.name,
            latitude=rec.latitude,
            longitude=rec.longitude
        ) for rec in result.all()]

    return StationsResponse(
        stations=stations,
        filters=None,
    )
