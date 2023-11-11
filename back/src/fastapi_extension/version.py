from collections.abc import Callable

from fastapi import APIRouter
from pydantic import BaseModel

VERSION_PATH = "/system/version"


class VersionSchema(BaseModel):
    version_hash: str
    environment: str


def git_strategy() -> str:  # deprecated
    return ""


def get_version_endpoint(
    environment: str,
    version_hash_strategy: Callable[[], str] = git_strategy,
) -> Callable[..., VersionSchema]:
    def version_endpoint() -> VersionSchema:
        return VersionSchema(version_hash=version_hash_strategy(), environment=environment)

    return version_endpoint


def get_version_router(
    environment: str,
    version_hash_strategy: Callable[[], str] = git_strategy,
) -> APIRouter:
    router = APIRouter(tags=["System"])
    version_endpoint = get_version_endpoint(environment=environment, version_hash_strategy=version_hash_strategy)
    router.add_api_route(VERSION_PATH, version_endpoint, response_model=VersionSchema)
    return router
