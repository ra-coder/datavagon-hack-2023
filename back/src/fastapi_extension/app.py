from collections.abc import Callable, Sequence
from typing import Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from .probes import (
    LivenessStatus,
    ReadinessStatus,
    StartupStatus,
    get_default_check_liveness_endpoint,
    get_default_check_readiness_endpoint,
    get_default_check_startup_endpoint,
    get_probes_router,
)
from .resources import add_resources_middleware
from .settings import BaseFastAPISettings
from .version import get_version_router, git_strategy


class AppBuilder:
    def __init__(self, title: str, debug: bool = False) -> None:
        self.app = FastAPI(title=title)
        self.debug = debug
        self.environment: str | None = None

    @classmethod
    def from_settings(cls, settings: BaseFastAPISettings, title: str) -> "AppBuilder":
        builder = cls(title=title, debug=settings.DEBUG)
        return builder

    def add_probes(
        self,
        session_fabric: Callable[[Request], AsyncSession] | None = None,
        liveness_endpoint: Callable[..., LivenessStatus] | None = None,
        readiness_endpoint: Callable[..., ReadinessStatus] | None = None,
        startup_endpoint: Callable[..., StartupStatus] | None = None,
    ) -> "AppBuilder":
        if liveness_endpoint is None and session_fabric is None:
            msg = f"Specify session_fabric or liveness_endpoint to {self.__class__.__name__}.add_probes"
            raise ValueError(msg)

        # Because of the check above, if liveness_endpoint is None,
        # session_fabric always is not None, but mypy can't get it.
        # So, I disable arg-type check.
        liveness_endpoint = liveness_endpoint or get_default_check_liveness_endpoint(
            session_fabric=session_fabric,  # type: ignore[arg-type]
        )
        readiness_endpoint = readiness_endpoint or get_default_check_readiness_endpoint()
        startup_endpoint = startup_endpoint or get_default_check_startup_endpoint()

        self.app.include_router(
            get_probes_router(
                liveness_endpoint=liveness_endpoint,
                readiness_endpoint=readiness_endpoint,
                startup_endpoint=startup_endpoint,
            ),
        )
        return self

    def add_resources(self) -> "AppBuilder":
        self.app = add_resources_middleware(self.app)
        return self

    def add_version_endpoint(
        self,
        environment: str | None = None,
        version_hash_strategy: Callable[[], str] = git_strategy,
    ) -> "AppBuilder":
        environment = environment or self.environment
        if environment is None:
            msg = "Environment isn't specified"
            raise ValueError(msg)

        self.app.include_router(
            get_version_router(
                environment=environment,
                version_hash_strategy=version_hash_strategy,
            ),
        )
        return self

    def allow_cors(
        self,
        allow_origins: Sequence[str] = ("*",),
        allow_credentials: bool = True,
        allow_methods: Sequence[str] = ("*",),
        allow_headers: Sequence[str] = ("*",),
        **kwargs: Any,
    ) -> "AppBuilder":
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=allow_origins,
            allow_credentials=allow_credentials,
            allow_methods=allow_methods,
            allow_headers=allow_headers,
            **kwargs,
        )
        return self

    def get_app(self) -> FastAPI:
        return self.app
