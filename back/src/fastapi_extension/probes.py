from typing import Literal
from collections.abc import Callable

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from ._optional_imports import AsyncSession, select

# todo:
#  must be changed together with k8s settings,
#  pls ask devops to change analytics, offloader, blurring, myocean services.
LIVENESS_PATH = "/system/probes/liveness"
READINESS_PATH = "/system/probes/readiness"
STARTUP_PATH = "/system/probes/startup"


class DBStatus(BaseModel):
    status: Literal["ok", "failure"]
    error: str | None


class LivenessStatus(BaseModel):
    status: Literal["ok"]
    db: DBStatus


class ReadinessStatus(BaseModel):
    """Stub schema.

    It'll be implemented by Aleksandr Tseluyko <aleksandr.tseluyko@mysky.com>.
    """


class StartupStatus(BaseModel):
    """Stub schema.

    It'll be implemented by Aleksandr Tseluyko <aleksandr.tseluyko@mysky.com>.
    """


def get_default_check_liveness_endpoint(session_fabric: Callable[[Request], AsyncSession]) -> Callable:
    async def check_liveness(session: AsyncSession = Depends(session_fabric)) -> LivenessStatus:
        query = select(1)
        await session.execute(query)
        db_status: Literal["ok"] = "ok"
        db_error = None
        # except Exception as err:  # pylint: disable=W0703

        return LivenessStatus(status="ok", db=DBStatus(status=db_status, error=db_error))

    return check_liveness


def get_default_check_readiness_endpoint() -> Callable:
    async def check_readiness() -> ReadinessStatus:
        """Temp stub endpoint.

        It'll be implemented by Aleksandr Tseluyko <aleksandr.tseluyko@mysky.com>.
        """
        return ReadinessStatus()

    return check_readiness


def get_default_check_startup_endpoint() -> Callable:
    async def check_startup() -> StartupStatus:
        """Temp stub endpoint.

        It'll be implemented by Aleksandr Tseluyko <aleksandr.tseluyko@mysky.com>.
        """
        return StartupStatus()

    return check_startup


def get_probes_router(
    liveness_endpoint: Callable[..., LivenessStatus],
    readiness_endpoint: Callable[..., ReadinessStatus],
    startup_endpoint: Callable[..., StartupStatus],
) -> APIRouter:
    router = APIRouter(tags=["System"])
    router.add_api_route(LIVENESS_PATH, liveness_endpoint, response_model=LivenessStatus)
    router.add_api_route(READINESS_PATH, readiness_endpoint, response_model=ReadinessStatus)
    router.add_api_route(STARTUP_PATH, startup_endpoint, response_model=StartupStatus)
    return router
