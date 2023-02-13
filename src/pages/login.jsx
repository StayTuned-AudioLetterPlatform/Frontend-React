import '../assets/css/login.css';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Login() {

    const [link, setLink] = useState('/');
    const [loginStatus, setLoginStatus] = useState(false);
    const navigate = useNavigate();

    const login = (event) => {
        alert(event.target.id);
        navigate('/main');
    }

    return (
        <div className={"landing-main"}>
            <img className={"landing-logo"} src={"logo.png"} alt={"landing logo"} />
            <p className={"landing-name"}>Stay Tuned!</p>
            <hr className={"landing-divider"} />
            <img className={"landing-button"} src={"kakao-talk.png"} alt={"kakao social login"} onClick={login} id={"kakao"}/>
            <img className={"landing-button"} src={"google-symbol.png"} alt={"google social login"} onClick={login} id={"google"}/>
            <img className={"landing-button"} src={"n.png.png"} alt={"naver social login"} onClick={login} id={"naver"}/>
        </div>
    );
}