alter table train
    add column arrived_at timestamp;
alter table train
    add column started_at timestamp;

update train
set arrived_at = _tmp.arrived_at_
from (select vagon_location_stream.train_index,
             min(moment) as arrived_at_
      from vagon_location_stream
               join train t on
                  vagon_location_stream.train_index = t.train_index
              and dislocation_station_id = t.to_station_id
-- where
--     vagon_location_stream.moment between
--         to_timestamp(1693130340 - 7*24*60*60)
--         and to_timestamp(1693130340)
      group by vagon_location_stream.train_index) as _tmp
where _tmp.train_index = train.train_index;


update train
set started_at = _tmp.started_at_
from (select vagon_location_stream.train_index,
             min(moment) as started_at_
      from vagon_location_stream
      group by vagon_location_stream.train_index) as _tmp
where _tmp.train_index = train.train_index;


select count(*) from vagon;