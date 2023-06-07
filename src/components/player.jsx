import React from 'react';

export default function Player(props) {
    return (
        <>
            <div>
                <audio src={"https://staytuned-audio-storage.s3.ap-northeast-2.amazonaws.com/test_20230405154223.wav"} controls>audio</audio>
            </div>
        </>
    );
}