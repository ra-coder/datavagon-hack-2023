import os

from fastapi import APIRouter, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from .schemas import TrainRouteInfo

train_api_router = APIRouter()


@train_api_router.get("/api/v1/train", response_model=TrainRouteInfo)
async def get_table_calendar(
    train_index: str = Query(alias="train_index"),
    # session: AsyncSession = Depends(get_session),
) -> TrainRouteInfo:
    query = text("""
        with train_timeline as (
        select
            vagon_location_stream.train_index,
            moment,
            dislocation_station_id,
            station.latitude,
            station.longitude,
            station.name as station_name,
            array_agg(vagon_id) as vagon_ids,
            train.name as train_name
        from datavagon.public.vagon_location_stream
        join station on vagon_location_stream.dislocation_station_id = station.id
        join train on train.train_index = vagon_location_stream.train_index
        where vagon_location_stream.train_index= :train_index
        group by vagon_location_stream.train_index, moment,
                 dislocation_station_id, latitude, longitude, station.name,
                 train.name
        order by
                train_index, moment
        )
        select
            jsonb_build_object(
            'train', jsonb_build_object(
                    'train_index', train_index,
                    'name', train_name
            ),
            'events', jsonb_agg(
                jsonb_build_object(
                        'moment', extract(epoch from moment)::int,
                        'moment_as_time_debug', moment,
                        'vagon_ids', vagon_ids,
                        'dislocation', jsonb_build_object(
                            'id', dislocation_station_id,
                            'name', station_name,
                            'latitude', latitude,
                            'longitude', longitude
                        )
                    )
            )
                ) as train_timeline
        from train_timeline
        group by train_index, train_name;    
    """)

    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        result = await session.execute(
            query,
            {"train_index": train_index},
        )
        data = result.fetchone()

    return TrainRouteInfo.parse_obj(data.train_timeline)
