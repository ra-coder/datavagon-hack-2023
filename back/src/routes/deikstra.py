import os

from fastapi import APIRouter, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from deikstra.graph import find_shortest_path_including_nodes, graph
from .schemas import Station

deikstra_api_router = APIRouter()


async def get_stations_path(path):
    query = text(
        """            
            select
                 jsonb_build_object(
                        'id', id,
                        'name', station.name,
                        'latitude', latitude,
                        'longitude', longitude
                ) as station
            from station
            where id = ANY( :path)
        """
    )
    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        result = await session.execute(
            query,
            params={
                "path": path,
            },
        )
        stations_by_id = {
            rec["id"]: Station.parse_obj(rec)
            for rec in result.scalars()
            if rec["latitude"] is not None
        }
    return [stations_by_id[st] for st in path]


@deikstra_api_router.get("/api/v1/deikstra")
async def get_path(
    from_station_id: int = Query(alias='from_station_id'),
    to_station_id: int = Query(alias='to_station_id'),
):
    shortest_path, shortest_length = find_shortest_path_including_nodes(
        graph,
        from_station_id,
        to_station_id,
    )
    shortest_path = [int(rec) for rec in shortest_path]

    return {
        "path": await get_stations_path(shortest_path),
        "length": float(shortest_length),
    }
