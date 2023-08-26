import React, {useState} from 'react';
import Recorder from "./recorder";
import styles from '../assets/css/iconSelector.module.css';

export default function IconSelector (props) {

    const iconTypes = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10]];

    const saveIconType = (iconNum) => {
        props.setContent(<Recorder name={props.name} iconType={iconNum}/>);
    }

    return(
        <div className={styles.container}>
            {
                iconTypes.map((iconLine, idx) => {
                    return(
                        <div key={idx} className={styles.shelf}>
                            {
                                iconLine.map((iconNum) => {
                                    return (
                                        <div className={styles.cassette} key={iconNum} onClick={() => {saveIconType(iconNum)}}>
                                            <img key={iconNum + "img"} className={styles.cassetteIcon} src={"/icons/cassette_ver" + iconNum + ".png"} />
                                            <div key={iconNum + "text"}>{iconNum}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}