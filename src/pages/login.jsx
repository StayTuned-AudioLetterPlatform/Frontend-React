import '../assets/css/login/login.css';
import React from 'react';
import axios from "axios";

export default function Login() {

    const login = (event) => {
        if(event.target.id === 'google'){
            console.log('in');
            axios.post('http://ec2-52-79-213-56.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google?redirect_uri=https://stay-tuned-frontend.vercel.app/main');
        }
    }

    return (
        <div className={"landing-main"}>
            <img className={"landing-logo"} src={"logo.png"} alt={"landing logo"} />
            <p className={"landing-name"}>Stay Tuned!</p>
            <hr className={"landing-divider"} />
            <img className={"landing-button"} src={"kakao-talk.png"} alt={"kakao social login"} onClick={login} id={"kakao"}/>
            <a href={'http://ec2-52-79-213-56.ap-northeast-2.compute.amazonaws.com:8080/oauth2/authorization/google?redirect_uri=https://stay-tuned-frontend.vercel.app//main'}>
                <img className={"landing-button"} src={"google-symbol.png"} alt={"google social login"} id={"google"} />
            </a>
            <img className={"landing-button"} src={"n.png.png"} alt={"naver social login"} onClick={login} id={"naver"}/>
        </div>
    );
}