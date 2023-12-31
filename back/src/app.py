from __future__ import annotations

import logging

import uvicorn
from fastapi.middleware.gzip import GZipMiddleware

from config import settings
from fastapi_extension import AppBuilder
from fastapi_extension.probes import DBStatus, LivenessStatus
from routes.peregon import peregon_api_router
from routes.station import station_api_router
from routes.train import train_api_router
from routes.vagon import vagon_api_router
from routes.deikstra import deikstra_api_router

logger = logging.getLogger(__name__)

app = (
    AppBuilder(title="wagon-wheels-app", debug=settings.DEBUG)
    .add_resources()
    .add_probes(
        liveness_endpoint=lambda: LivenessStatus(status="ok", db=DBStatus(status="ok", error=None)),
    ).allow_cors()
    .get_app()
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(train_api_router)
app.include_router(vagon_api_router)
app.include_router(station_api_router)
app.include_router(peregon_api_router)
app.include_router(deikstra_api_router)


def traces_sampler(context: dict) -> float:
    if "/system/probes" in context.get("asgi_scope", {}).get("path", ""):
        return 0.0
    return settings.SENTRY_TRACES_RATE


@app.on_event("startup")
async def startup_event() -> None:
    pass


@app.on_event("shutdown")
async def shutdown_event() -> None:
    logger.info("Shutdown app")


if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",  # noqa: S104
        port=settings.PORT,
        reload=settings.DEBUG,
        use_colors=True,
        log_level=settings.LOG_LEVEL.lower(),
    )
