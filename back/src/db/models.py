from typing import Any

#from geoalchemy2 import Geometry
from sqlalchemy import Column, Float, Integer, Numeric, Sequence, Text, String, DateTime, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.schema import ForeignKey

Base: Any = declarative_base()


class Station(Base):
    __tablename__ = "station"
    __table_args__ = (
        Index("station__id__idx", "id"),
    )

    id = Column(Integer, primary_key=True)
    name = Column(Text)  # generated name from faker
    latitude = Column(Float)
    longitude = Column(Float)
    # location = Column(Geometry('POINT'))


class Peregon(Base):
    __tablename__ = "peregon"
    __table_args__ = (
        Index("peregon__from_station_id__idx", "from_station_id"),
        Index("peregon__to_station_id__idx", "to_station_id"),
    )

    id = Column(Integer, Sequence("peregon_id_seq"), primary_key=True)
    from_station_id = Column(Integer, ForeignKey('station.id'), nullable=False)
    to_station_id = Column(Integer, ForeignKey('station.id'), nullable=False)
    len_km = Column(Numeric)


class Vagon(Base):
    __tablename__ = "vagon"
    __table_args__ = (
        Index("vagon__id__idx", "id"),
    )

    id = Column(Integer, primary_key=True)
    name = Column(Text)  # generated name from faker


class Train(Base):
    __tablename__ = "train"
    __table_args__ = (
        Index("train__train_index__idx", "train_index"),
        Index("train__number__idx", "number"),
        Index("train__to_station_id__idx", "to_station_id", "from_station_id"),
        Index("train__from_station_id__idx", "from_station_id", "to_station_id"),
    )

    train_index = Column(String(32), primary_key=True)
    from_station_id = Column(Integer, ForeignKey('station.id'), nullable=True)
    to_station_id = Column(Integer, ForeignKey('station.id'), nullable=True)
    number = Column(Integer)
    name = Column(Text)  # generated name from faker


class VagonLocationStream(Base):
    __tablename__ = "vagon_location_stream"
    __table_args__ = (
        Index("stream__vagon_id__idx", "vagon_id", "moment"),
        Index("stream__train_index__idx", "train_index", "moment", "vagon_id"),
    )
    id = Column(Integer, Sequence("vagon_location_stream_id_seq"), primary_key=True)
    vagon_id = Column(Integer, ForeignKey('vagon.id'), nullable=False)
    moment = Column(DateTime, nullable=False)
    dislocation_station_id = Column(Integer, ForeignKey('station.id'), nullable=True)
    to_station_id = Column(Integer, ForeignKey('station.id'), nullable=True)
    train_index = Column(String(32), ForeignKey('train.train_index'), nullable=True)
