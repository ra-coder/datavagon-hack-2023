from __future__ import annotations

from typing import List

from pydantic import BaseModel


class Train(BaseModel):
    name: str
    train_index: str


class Dislocation(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float


class TrainEvent(BaseModel):
    moment: int
    vagon_ids: List[int]
    dislocation: Dislocation
    moment_as_time_debug: str


class TrainRouteInfo(BaseModel):
    train: Train
    events: List[TrainEvent]
