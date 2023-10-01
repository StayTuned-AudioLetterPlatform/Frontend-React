import React from 'react';

export default function Header() {

    //get path
    var page = window.location.href.split('?')[0].split('/')[1];

    return (
        <header className="App-header">
            <img className={"App-logo"} src={"logo.png"} alt={"header logo"}/>
            <h1 className={"font-face-sw"}>Stay Tuned!</h1>
            { page === "main" ? <img className={"menu-logo"} src={"speech-bubble.png"} alt={"menu logo"} />: null}
        </header>
    );
}