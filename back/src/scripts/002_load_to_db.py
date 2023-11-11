import asyncio
import csv
import datetime
import logging
import os
import sys
from pathlib import Path

from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

path_root = Path(__file__).parents[1]
print(path_root)
sys.path.append(str(path_root))

from db.models import Station, Peregon, Train, VagonLocationStream, Vagon


def station_generator():
    Faker.seed(0)
    fake = Faker()
    with open('../../data/parsed/STATION_COORDS_HACKATON.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # {'': '0', 'ST_ID': '2', 'LATITUDE': '48.4272', 'LONGITUDE': '42.2162'}
            try:
                yield Station(
                    id=int(row['ST_ID']),
                    name=fake.city(),
                    latitude=float(row['LATITUDE']),
                    longitude=float(row['LONGITUDE']),
                )
            except ValueError:
                logging.info("bad record %r", row)


def peregon_middle_stations_generator():
    known_stations = set()
    with open('../../data/parsed/STATION_COORDS_HACKATON.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            known_stations.add(int(row['ST_ID']))

    with open('../../data/parsed/PEREGON_HACKATON.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            for station_id in (row['START_CODE'], row['END_CODE']):
                station_id = int(station_id)
                if station_id not in known_stations:
                    yield Station(
                        id=station_id,
                        name=f"mestechko_{station_id}",
                        latitude=None,
                        longitude=None,
                    )
                    known_stations.add(station_id)


def peregon_generator():
    with open('../../data/parsed/PEREGON_HACKATON.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # print(row)
            # {'': '0', 'START_CODE': '2', 'END_CODE': '805', 'LEN': '32'}
            yield Peregon(
                from_station_id=int(row['START_CODE']),
                to_station_id=int(row['END_CODE']),
                len_km=float(row['LEN']),
            )


def stream_middle_stations_generator():
    known_stations = set()
    with open('../../data/parsed/STATION_COORDS_HACKATON.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            known_stations.add(int(row['ST_ID']))

    with open('../../data/parsed/PEREGON_HACKATON.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            for station_id in (row['START_CODE'], row['END_CODE']):
                station_id = int(station_id)
                if station_id not in known_stations:
                    known_stations.add(station_id)

    for index in range(1, 15):
        with open(f'../../data/parsed/disl_hackaton_Sheet {index}.csv', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['TRAIN_INDEX']:
                    train_from, train_num, train_to = row['TRAIN_INDEX'].split('-')
                else:
                    train_from, train_to = None, None
                for station_id in (train_from, train_to, row['ST_ID_DISL'], row['ST_ID_DEST']):
                    if station_id:
                        station_id = int(float(station_id))  # '21512.0'  ???
                        if station_id not in known_stations:
                            yield Station(
                                id=station_id,
                                name=f"uezd_{station_id}",
                                latitude=None,
                                longitude=None,
                            )
                            known_stations.add(station_id)


def stream_train_generator():
    Faker.seed(0)
    fake = Faker()
    known_trains = set()
    for index in range(1, 15):
        with open(f'../../data/parsed/disl_hackaton_Sheet {index}.csv', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['TRAIN_INDEX']:
                    train_from, train_num, train_to = row['TRAIN_INDEX'].split('-')
                    if train_num and row['TRAIN_INDEX'] not in known_trains:
                        yield Train(
                            train_index=row['TRAIN_INDEX'],
                            from_station_id=int(train_from) if train_from else None,
                            to_station_id=int(train_to) if train_to else None,
                            number=int(train_num),
                            name=fake.color_name(),
                        )
                        known_trains.add(row['TRAIN_INDEX'])


def stream_wagon_generator():
    Faker.seed(0)
    fake = Faker()
    known_vagons = set()
    for index in range(1, 15):
        with open(f'../../data/parsed/disl_hackaton_Sheet {index}.csv', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                vagon_id = int(row['WAGNUM'])
                if vagon_id not in known_vagons:
                    yield Vagon(
                        id=vagon_id,
                        name=f'{fake.first_name_male()} {fake.language_name()} {fake.last_name()}'
                    )
                    known_vagons.add(vagon_id)


def stream_events_generator_1_5():
    for index in range(1, 2):
        with open(f'../../data/parsed/disl_hackaton_Sheet {index}.csv', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                vagon_id = int(row['WAGNUM'])
                if row['TRAIN_INDEX']:
                    yield VagonLocationStream(
                        vagon_id=vagon_id,
                        moment=datetime.datetime.strptime(row["OPERDATE"], "%Y-%m-%d %H:%M:%S"),
                        dislocation_station_id=int(float(row["ST_ID_DISL"])),
                        to_station_id=int(float(row["ST_ID_DEST"])),
                        train_index=row["TRAIN_INDEX"]
                    )
                else:
                    yield VagonLocationStream(
                        vagon_id=vagon_id,
                        moment=datetime.datetime.strptime(row["OPERDATE"], "%Y-%m-%d %H:%M:%S"),
                        dislocation_station_id=int(float(row["ST_ID_DISL"])),
                        to_station_id=int(float(row["ST_ID_DEST"])),
                        train_index=None,
                    )


def stream_events_generator(sheet_index):
    with open(f'../../data/parsed/disl_hackaton_Sheet {sheet_index}.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            vagon_id = int(row['WAGNUM'])
            if row['TRAIN_INDEX']:
                yield VagonLocationStream(
                    vagon_id=vagon_id,
                    moment=datetime.datetime.strptime(row["OPERDATE"], "%Y-%m-%d %H:%M:%S"),
                    dislocation_station_id=int(float(row["ST_ID_DISL"])),
                    to_station_id=int(float(row["ST_ID_DEST"])),
                    train_index=row["TRAIN_INDEX"]
                )
            else:
                yield VagonLocationStream(
                    vagon_id=vagon_id,
                    moment=datetime.datetime.strptime(row["OPERDATE"], "%Y-%m-%d %H:%M:%S"),
                    dislocation_station_id=int(float(row["ST_ID_DISL"])),
                    to_station_id=int(float(row["ST_ID_DEST"])),
                    train_index=None,
                )


async def insert_values(models_generator):
    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    async with AsyncSession(engine) as session:
        counter = 0
        for rec in models_generator:
            session.add(rec)
            counter += 1
            if counter % 10000 == 0:
                await session.flush()
        await session.commit()


loop = asyncio.get_event_loop()
# loop.run_until_complete(insert_values(station_generator()))
# loop.run_until_complete(insert_values(peregon_middle_stations_generator()))
# loop.run_until_complete(insert_values(peregon_generator()))
# loop.run_until_complete(insert_values(stream_middle_stations_generator())) # no extra
# loop.run_until_complete(insert_values(stream_train_generator()))
# loop.run_until_complete(insert_values(stream_events_generator_1_5()))
for index in range(2, 15):
    loop.run_until_complete(insert_values(stream_events_generator(index)))
    print(f"done sheet {index}")
