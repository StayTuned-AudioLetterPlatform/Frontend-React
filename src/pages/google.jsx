import React, {useEffect} from 'react';
import '../assets/css/google.css';
import {useNavigate} from "react-router-dom";

export default function Google() {
    const navigate = useNavigate();
    var fragmentString = window.location.href.split('?')[1];
    console.log(fragmentString);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
        localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
        if (params['state'] && params['state'] === 'pass-through-value') {
            console.log(params);
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(params)
            };
            fetch('http://localhost:8080/api/v1/login/oauth2/code/*', requestOptions).then(async response =>{
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                //check for error
                if(!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                navigate('/main');
            }).catch(err => {
                console.error('An error occured -> ', err);
            });
        }
    }

    return (
        <div>g</div>
    );
};