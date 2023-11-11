# import pandas as pd
# xl = pd.ExcelFile('../../../data/new_STATION_COORDS_HACKATON.xlsx')
#
# for s_name in xl.sheet_names:
#     data_xls = pd.read_excel('../../../data/new_STATION_COORDS_HACKATON.xlsx', s_name, index_col=None)
#     data_xls.to_csv(f'../../../data/parsed/new_STATION_COORDS_HACKATON.csv', encoding='utf-8')
#

import asyncio
import csv
import logging
import os
import sys
from pathlib import Path

from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy import select

path_root = Path(__file__).parents[1]
print(path_root)
sys.path.append(str(path_root))

from db.models import Station


def station_generator():
    Faker.seed(0)
    fake = Faker()
    with open('../../data/parsed/new_STATION_COORDS_HACKATON.csv', newline='') as csvfile:
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


async def update_values(models_generator):
    db_dsn = os.getenv("DB_DSN")
    engine = create_async_engine(db_dsn)
    csv_recs_by_id = {}
    for rec in models_generator:
        csv_recs_by_id[rec.id] = rec

    async with AsyncSession(engine) as session:
        resc = await session.execute(
            select(
                Station
            )
        )
        for rec in resc.scalars():
            if rec.id in csv_recs_by_id:
                control_rec = csv_recs_by_id[rec.id]
                rec.latitude = control_rec.latitude
                rec.longitude = control_rec.longitude
                csv_recs_by_id.pop(rec.id)
            else:
                print(f'removed {rec}')
        print(f'{len(csv_recs_by_id)} new stations')
        for rec in csv_recs_by_id.values():
            session.add(rec)

        await session.commit()


loop = asyncio.get_event_loop()
loop.run_until_complete(update_values(station_generator()))
