# Fastapi-extension

Lib designed especially for FastAPI package and adds additions
for optimizations, integrations and standardization.

## Submodules

### Probes

Probes - standard endpoints for every MySky microservice
which lets k8s get what's going on inside the app.

There are only 3 endpoint:

* **liveness**
* **readiness**
* **startup**

This submodule contains standard implementations for every of 3 routes,
but it's possible to replace them if your app has specific status checks.

### Resources

Resources - optimizations submodule designed to fiz a old FastAPI
framework trouble: when somebody starts a request to your app and
app has some `fastapi.Depends` as connect to DB, then your app may
abuse the connections pool. Here how it works: imagine you have typical
getter for fastapi like this:

```python
from sqlalchemy.orm import Session


def get_session():
    with Session() as session:
        yield session
```

or even like this:

```python
from sqlalchemy.orm import Session


def get_session():
    session = Session()
    try:
        yield session
    finally:
        session.close()
```

Then there will be next steps:
1. Somebody requests your app
2. The app inits a session and `yield session`.
3. The app processes the handler.
4. Returns the result.
5. That's all! The app will not call `session.close()` or exits from `with` block.
   Anyway till the new request.
   
When your app gets a new request, you will have these steps:
1. The app close the old session.
2. Your app gets the new request.
3. The app inits a session and `yield session`.
4. The app processes the handler.
5. Returns the result.

Finally, if you don't have enough high-load, you abuse connections,
and as a result, you may get time-outs.

I understand it's not easy to get this unbelievable shit, but it's truth and
easy to prove with a few lines of code.

---

Resources make a link to a request object and closes all connections on middleware.
When you use them, you can be sure that all connections will be closed immediately
after a handler processing finish.

To use resources just follow only 2 steps:

1. Use resources classes on dependency getters:

```python
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi_extension.resources import SessionResource


def get_session(request: Request):
    return SessionResource(request, AsyncSession).session
```

2. Add resources middleware to your fastapi app:

```python
from fastapi_extension import AppBuilder

app = AppBuilder(title="MySuperDuperApp").add_resources().get_app()
```

### Settings

This submodule contains a pydantic settings preset which lets you make
app faster and add standard environment variables:

```python
from fastapi_extension.settings import BaseFastAPISettings


class Settings(BaseFastAPISettings):
    DB_DSN: str
    . . .


settings = Settings()
```

After that you can build an app instance faster with using
`AppBuilder.from_settings` constructor:

```python
from fastapi_extension import AppBuilder

from config import settings

app = AppBuilder.from_settings(title="MySuperDuperApp", settings=settings).get_app()
```

Note: It's not required to use. If you want to define envs yourself, you can.

### App

This submodule has only a single app builder which includes all features from the above.
Just type following lines, and you will get fully configured app:

```python
from fastapi_extension import AppBuilder

from config import settings
from db import get_session

app = (
    AppBuilder
    .from_settings(title="MySuperDuperApp", settings=settings)
    .add_probes(session_fabric=get_session)
    .add_resources()
    .get_app()
)
```

Btw you always can create instance without usage `BaseFastAPISettings`:

```python
from fastapi_extension import AppBuilder

from config import settings
from db import get_session

builder = (
    AppBuilder(title="MySuperDuperApp", debug=settings.DEBUG)
    .add_probes(session_fabric=get_session)
    .add_resources()
)
if settings.SENTRY_ENABLED:
    builder = builder.add_sentry(
        sentry_dsn=settings.SENTRY_DSN,
        sentry_environment=settings.SENTRY_ENVIRONMENT,
        sentry_traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
        sentry_integrations=[...],
    )
app = builder.get_app()
```
