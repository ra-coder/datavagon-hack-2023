import React from 'react';
import {Ymaps, withMap} from './withMap';
import {stringifyDate} from './utils';

export const TrainHint = withMap(function({ymaps}: Ymaps) {
    const ctx = React.useContext(ymaps.YMapHintContext);

    if (ctx?.hint.type !== 'train') return null;

    return <div className="hint">
        {ctx?.hint.moment && <div>{stringifyDate(new Date(ctx.hint.moment)).join(' ')}</div>}
        <br/>
        {ctx?.hint.train_index && <div>Поезд №{ctx.hint.train_index}</div>}
        {ctx?.hint.dislocation && <div>Станция №{ctx.hint.dislocation.id}</div>}
        {ctx?.hint.dislocation.name && <div>"{ctx.hint.dislocation.name}"</div>}
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
