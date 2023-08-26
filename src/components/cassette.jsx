import React from 'react';
import '../assets/css/cassette.css'

export default function Cassette({nickname, voiceFileKey, iconType, clickFunction}) {

    const play = () => {
        if(clickFunction){
            clickFunction(voiceFileKey);
        }
    }

    return(
        <div className={"cassette"}>
            <img className={"cassette-content"} src={"/icons/cassette_ver" + (parseInt(iconType) % 13).toString() + ".png"} onClick={play}/>
            <div className={"cassette-content"}>
                <h3 className={"nickname"}>{nickname}</h3>
            </div>
        </div>
    );
};