import '../assets/css/login.css';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Login() {

    const googleSignIn = useRef(null);

    const [loginInfo, setLoginInfo] = useState({
        postID: '',
        errorMessage: ''
    });

    const handleCredentialResponse = async (res) => {
        console.log(res);

    }

    const useScript = (url, onload) => {
        useEffect(() => {
            const script = document.createElement('script');

            script.src = url;
            script.onload = onload;

            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }, [url, onload]);
    };

    /*useScript('https://accounts.google.com/gsi/client', () => {
        window.google.accounts.id.initialize({
            client_id: '',
            callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(googleSignIn.current, {
            display:'none'
        });
    });*/
    var fragmentString = window.location.hash.substring(1);

    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length > 0) {
        localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
        if (params['state'] && params['state'] === 'pass-through-value') {
            trySampleRequest();
        }
    }

    // If there's an access token, try an API request.
    // Otherwise, start OAuth 2.0 flow.
    function trySampleRequest() {
        var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
        if (params && params['access_token']) {
            console.log(params['access_token']);
            navigate('/main');
        } else {
            console.log('first');
            oauth2SignIn();
        }
    }

    /*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
    function oauth2SignIn() {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {'client_id': '',
            'redirect_uri': 'http://localhost:3000/google-callback',
            'response_type': 'code',
            'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
            'include_granted_scopes': 'true',
            'state': 'pass-through-value'};

        // Add form parameters as hidden input values.
        for (var p in params) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
    }

    const login = (event) => {
        if(event.target.id === 'google'){
            console.log('in');
            //document.querySelector('[aria-labelledby="button-label"]').click();
            trySampleRequest();
        }
    }

    return (
        <div className={"landing-main"}>
            <img className={"landing-logo"} src={"logo.png"} alt={"landing logo"} />
            <p className={"landing-name"}>Stay Tuned!</p>
            <hr className={"landing-divider"} />
            <img className={"landing-button"} src={"kakao-talk.png"} alt={"kakao social login"} onClick={login} id={"kakao"}/>
            <img className={"landing-button"} src={"google-symbol.png"} alt={"google social login"} onClick={login} id={"google"} ref={googleSignIn}/>
            <img className={"landing-button"} src={"n.png.png"} alt={"naver social login"} onClick={login} id={"naver"}/>
        </div>
    );
}