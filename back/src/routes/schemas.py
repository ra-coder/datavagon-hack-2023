from __future__ import annotations

from pydantic import BaseModel


class Train(BaseModel):
    name: str
    train_index: str


class Dislocation(BaseModel):
    id: int
    name: str
    latitude: float | None
    longitude: float | None


class TrainEvent(BaseModel):
    moment: int
    vagon_ids: list[int]
    dislocation: Dislocation
    moment_as_time_debug: str


class TrainRouteInfo(BaseModel):
    train: Train
    events: list[TrainEvent]


class Vagon(BaseModel):
    id: int
    name: str


class VagonEvent(BaseModel):
    train: Train
    moment: int
    dislocation: Dislocation


class VagonRouteInfo(BaseModel):
    vagon: Vagon
    events: list[VagonEvent]


class Station(BaseModel):
    id: int
    name: str
    latitude: float | None
    longitude: float | None


class StationsResponse(BaseModel):
    stations: list[Station]
    filters: dict | None


class Peregon(BaseModel):
    id: int
    from_station_id: int
    to_station_id: int
    len_km: float


class PeregonsResponse(BaseModel):
    peregons: list[Peregon]
    filters: dict | None
