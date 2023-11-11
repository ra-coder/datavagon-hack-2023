import os

from fastapi import APIRouter, Path
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from .schemas import VagonRouteInfo

vagon_api_router = APIRouter()


@vagon_api_router.get("/api/v1/vagon/{vagon_id}/timeline", response_model=VagonRouteInfo)
async def get_table_calendar(
    vagon_id: int,
    # session: AsyncSession = Depends(get_session),
) -> VagonRouteInfo:
    query = text("""
        select
            jsonb_build_object(
            'vagon', jsonb_build_object(
                'id', vagon_id,
                'name', vagon.name
            ),
            'events', jsonb_agg(
                jsonb_build_object(
                        'moment', extract(epoch from moment)::int,
                      --  'moment_as_time_debug', moment,
                        'dislocation', jsonb_build_object(
                            'id', dislocation_station_id,
                            'name', station.name,
                            'latitude', latitude,
                            'longitude', longitude
                        ),
                        'train', jsonb_build_object(
                                'train_index', train.train_index,
                                'name', train.name
                        )
                    )
                ORDER BY vagon_id, moment
            )
        ) as vagon_timeline
        from datavagon.public.vagon_location_stream
        join station on vagon_location_stream.dislocation_station_id = station.id
        join train on train.train_index = vagon_location_stream.train_index
        join vagon on vagon_location_stream.vagon_id = vagon.id
        where vagon_location_stream.vagon_id = :vagon_id
        group by vagon_id, vagon.name;
    """)

    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        result = await session.execute(
            query,
            {"vagon_id": vagon_id},
        )
        data = result.fetchone()

    return VagonRouteInfo.parse_obj(data.vagon_timeline)
