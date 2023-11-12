import React from 'react';
import {Ymaps, withMap} from '../hooks/withMap';
import {stringifyDate} from '../utils';

export const WagonHint = withMap(function ({ymaps}: Ymaps) {
    const ctx = React.useContext(ymaps.YMapHintContext);

    if (ctx?.hint.type !== 'wagon') return null;

    return (
        <div className="hint">
            {ctx?.hint.moment && <div>{stringifyDate(new Date(ctx.hint.moment * 1000)).join(' ')}</div>}
            <br />
            {ctx?.hint.id && <div>Вагон №{ctx.hint.id}</div>}
            {ctx?.hint.name && <div>"{ctx.hint.name}"</div>}
            {ctx?.hint.train && <div>Поезд №{ctx.hint.train.train_index}</div>}
            {ctx?.hint.train && <div>"{ctx.hint.train.name}"</div>}
        </div>
    );
});
