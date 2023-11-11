import React from 'react';
import {Ymaps, withMap} from './withMap';
import {stringidyDate} from './utils';

export const TrainHint = withMap(function TrainHintInt({ymaps}: Ymaps) {
    const ctx = React.useContext(ymaps.YMapHintContext);
    return <div className="hint">
        {ctx?.hint.id && <div>Поезд №{ctx.hint.id}</div>}
        {ctx?.hint.moment && <div>{stringidyDate(new Date(ctx.hint.moment)).join(' ')}</div>}
        {ctx?.hint.vagon_ids && (
            <div>
                Состоит из вагонов:
                <ul>
                    {ctx?.hint.vagon_ids.map((id: number) => <li key={id}>{id}</li>)}
                </ul>
            </div>
        )}
    </div>;
})
