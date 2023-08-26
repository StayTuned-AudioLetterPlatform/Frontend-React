import React from 'react';

export default function Player(props) {
    return (
        <>
            <div>
                <audio src={props.voiceKey} controls>audio</audio>
            </div>
        </>
    );
}