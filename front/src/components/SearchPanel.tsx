import React from 'react'
import './SearchPanel.css'
import { pushHistory, useWatchHistory } from '../hooks/useHistory';
import { getTrainTimeLineNonStamp, getWagonTimeLineNonStamp } from '../requests';

const isExistTrain = (id: string): Promise<boolean> => {
    return getTrainTimeLineNonStamp(id).then((data) => {
        const detail = (data as unknown as { detail: string }).detail
        if (detail) {
            return false;
        }
        return true;
    }).catch(() => false);
}

const isExistWagon = (id: string): Promise<boolean> => {
    return getWagonTimeLineNonStamp(id).then((data) => {
        const detail = (data as unknown as { detail: string }).detail
        if (detail) {
            return false;
        }
        return true;
    }).catch(() => false);
}

export const SearchPanel: React.FC = () => {
    const params = useWatchHistory();
    const [val, setVale] = React.useState(params.id ?? '');
    const [load, setLoad] = React.useState(false);

    React.useEffect(() => {
        setVale(params.id ?? '');
    }, [params])

    const onKeyUp = (e: any) => {
        const trimmed = val.trim();
        if (e.keyCode === 13 && trimmed && trimmed !== params.id) {
            setLoad(true);
            isExistTrain(trimmed).then(isExist => {
                if (isExist) {
                    pushHistory(`train/${trimmed}`);
                    setLoad(false);
                } else {
                    isExistWagon(trimmed).then((isWE) => {
                        if (isWE) {
                            pushHistory(`wagon/${trimmed}`);
                        }
                        setLoad(false);
                    })
                }
            })
        }
    }

    return (
        <div className='SearchPanel'>
            <input
                placeholder='train_index/wagnum'
                disabled={load}
                value={val}
                onKeyUp={onKeyUp}
                onChange={(e) => setVale(e.target.value)}
            />
        </div>
    )
}
