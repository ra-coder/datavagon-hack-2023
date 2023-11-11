import React from 'react';
import ReactDOM from 'react-dom';
import type Main from '@yandex/ymaps3-types/react';
import type SphericalMerkatorPackage from '@yandex/ymaps3-types/packages/spherical-mercator-projection';
import type ControlsPackage from '@yandex/ymaps3-types/packages/controls/react';

interface HintPackage {
    YMapHint: React.FC<React.PropsWithChildren<
        {hint: (object: {properties: {hint: any}} | undefined) => unknown}
    >>;
    YMapHintContext: React.Context<{hint: any}>;
}

type YmapsModule = typeof Main & typeof SphericalMerkatorPackage & typeof ControlsPackage & HintPackage;
export interface Ymaps {
    ymaps: YmapsModule
}

let ymapsPromise: Promise<YmapsModule>;
export function withMap<T extends Ymaps>(Child: React.ComponentType<T>) {
    return (props: Omit<T, 'ymaps'>) => {
        const [ymaps, setYmaps] = React.useState<YmapsModule>();

        React.useEffect(() => {
            ymapsPromise ??= getYmapsPromise();

            ymapsPromise.then(setYmaps)
        }, [])

        if (!ymaps) return null;

        return (
            <Child {...props as T} ymaps={ymaps} />
        );
    }
}

async function getYmapsPromise(): Promise<YmapsModule> {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const sphericalMercator = await ymaps3.import('@yandex/ymaps3-spherical-mercator-projection@0.0.1');
    const controls = reactify.module(await ymaps3.import('@yandex/ymaps3-controls@0.0.1'));
    const hint = reactify.module(await ymaps3.import('@yandex/ymaps3-hint@0.0.1'));

    return {
        ...reactify.module(ymaps3),
        ...sphericalMercator,
        ...controls,
        ...hint as unknown as HintPackage,
        reactify
    };
}
