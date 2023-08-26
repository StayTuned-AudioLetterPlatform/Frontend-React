import React from 'react';

export default function Popup (props) {
    return (
        <div className={"pop-up"} ref={props.innerRef}>
            {props.inner}
            <button onClick={props.disappearPopup} className={"pop-up-button"}>close</button>
        </div>
    );
}