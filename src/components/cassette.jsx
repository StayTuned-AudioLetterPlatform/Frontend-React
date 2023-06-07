import React from 'react';
import '../assets/css/cassette.css'

export default function Cassette({nickname, voiceFileKey, iconType, clickFunction}) {

    const play = () => {
        clickFunction(voiceFileKey);
    }

    return(
        <div className={"cassette"}>
            <img className={"cassette-icon"} src={"/icons/cassette_ver" + (parseInt(iconType) % 13).toString() + ".png"} onClick={play}/>
            <h3 className={"nickname"}>{nickname}</h3>
        </div>
    );
};