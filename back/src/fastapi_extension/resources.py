from abc import ABCMeta, abstractmethod
from collections.abc import Awaitable, Callable
from typing import Any

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing_extensions import override

from ._optional_imports import AsyncFileSystem, AsyncS3Adapter, AsyncSession


class MiddlewareResourceMeta(ABCMeta):  # noqa: B024,RUF100
    """Singleton which makes link to request.state."""

    @override
    def __call__(cls, request: Request, *args: Any, **kwargs: Any) -> Any:
        resources = request.state.resources
        if cls not in resources:
            resources[cls] = super().__call__(request, *args, **kwargs)
        return resources[cls]


class MiddlewareResource(metaclass=MiddlewareResourceMeta):
    request: Request

    def __init__(self, request: Request) -> None:
        self.request = request

    @abstractmethod
    async def clean_up(self) -> None:
        raise NotImplementedError


class SessionResource(MiddlewareResource):
    def __init__(self, request: Request, session_fabric: Callable[[], AsyncSession]) -> None:
        super().__init__(request)
        self.session: AsyncSession = session_fabric()

    @override
    async def clean_up(self) -> None:
        await self.session.close()


class FileSystemResource(MiddlewareResource):
    def __init__(self, request: Request, filesystem: AsyncFileSystem) -> None:
        super().__init__(request)
        self.filesystem: AsyncFileSystem = filesystem

    @override
    async def clean_up(self) -> None:
        await self.filesystem.s3_adapter.close()


class S3Resource(MiddlewareResource):
    def __init__(self, request: Request, s3_adapter: AsyncS3Adapter) -> None:
        super().__init__(request)
        self.s3_adapter: AsyncS3Adapter = s3_adapter

    @override
    async def clean_up(self) -> None:
        await self.s3_adapter.close()


async def cleanup_resources_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    try:
        request.state.resources = {}
        response = await call_next(request)
    finally:
        for resource in request.state.resources.values():
            await resource.clean_up()
    return response


def add_resources_middleware(app: FastAPI) -> FastAPI:
    app.add_middleware(BaseHTTPMiddleware, dispatch=cleanup_resources_middleware)
    return app
