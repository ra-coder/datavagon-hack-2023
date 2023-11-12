import React from 'react';

import './Loading.css';

interface Props {
    loading: boolean;
}

export const Loading: React.FC<Props> = ({
    loading
}) => {
    if (!loading) {
        return null;
    }

    return (
        <div className='Loading'>
            <div>
                Подождите, собираем данные...
            </div>
            <div className='Loading__train'></div>
        </div>
    )
}
