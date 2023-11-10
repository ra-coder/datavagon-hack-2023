from typing import Any

from geoalchemy2 import Geometry
from sqlalchemy import Column, Float, Integer, Numeric, Sequence, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.schema import ForeignKey

Base: Any = declarative_base()


class Station(Base):
    __tablename__ = "station"

    id = Column(Integer, primary_key=True)
    name = Column(Text)  # generated name from faker
    latitude = Column(Float)
    longitude = Column(Float)
    location = Column(Geometry('POINT'))


class Peregon(Base):
    __tablename__ = "peregon"

    id = Column(Integer, Sequence("station_id_seq"), primary_key=True)
    from_station_id = Column(Integer, ForeignKey('station.id'), nullable=False)
    to_station_id = Column(Integer, ForeignKey('station.id'), nullable=False)
    len_km = Column(Numeric)
