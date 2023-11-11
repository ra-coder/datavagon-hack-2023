import React from 'react';
import {Ymaps, withMap} from './withMap';

export const TrainHint = withMap(function TrainHintInt({ymaps}: Ymaps) {
    const ctx = React.useContext(ymaps.YMapHintContext);
    return <div className="hint">
        {ctx?.hint.moment && <div>{new Date(ctx.hint.moment).toISOString().replace('T', ' ').slice(0, 19)}</div>}
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
