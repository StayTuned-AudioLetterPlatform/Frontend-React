import React from 'react';

export default function Cassette({nickname, iconType, voiceFileKey}) {
    return(
        <div className={"cassette"}>
            <h3>{nickname}</h3>
            <p>{iconType}</p>
            <p>{voiceFileKey}</p>
        </div>
    );
};