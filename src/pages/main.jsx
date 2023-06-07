import React, {useEffect, useRef, useState} from 'react';
import '../assets/css/main.css';
import Cassette from "../components/cassette";
import Recorder from "../components/recorder";
import Popup from "../components/popup";
import jwt_decode from "jwt-decode";
import Player from "../components/player";
import axios from "axios";
import Crypto from 'crypto-js';

export default function Main() {

    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [cassettes, setCassettes] = useState([]);
    const [offset, setOffset] = useState(0);
    const [content, setContent] = useState(null);
    const [isUser, setIsUser] = useState(false);
    const popup = useRef();

    useEffect(() => {
        //get user info
        var fragmentString = window.location.href.split('?')[1];

        // Parse query string to see if page request is coming from OAuth 2.0 server.
        var params = {};
        var regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(fragmentString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        const token = params.access_token;
        const decoded = jwt_decode(token);
        console.log(decoded);
        setUser(decoded);
        window.localStorage.setItem('expireAt', decoded.exp);
        window.localStorage.setItem('initialAt', decoded.iat);

        //create random url
        let url = 'http://localhost:8080/api/v1/voicemail/List/';
        console.log(process.env.REACT_APP_IV);
        const encryptedURL = Crypto.AES.encrypt(decoded.code.toString(), Crypto.enc.Utf8(process.env.REACT_APP_SECRETKEY), {
            iv: Crypto.enc.Utf8(process.env.REACT_APP_IV),
        });
        window.localStorage.setItem('inviteURL', url + encodeURIComponent(encryptedURL.toString()));

        //get cassette data name server
        axios.get('http://localhost:8080/api/v1/voicemail/List/' + decoded.code.toString())
            .then((res) => {
                console.log(res);
                setData(res.data);
            })
            .catch((e)=>{
                alert("An unexpected error occured while getting user data from the server. Please contact the team to resolve this error. error code: " + e);
            });
    }, []);

    useEffect(() => {
        //temp code
        setCassettes(() => {
            const numShelfs = data.length % 3 === 0 ? data.length / 3 : data.length / 3 + 1;
            const dividedCassetteArr = [];
            for(let i = 0; i < numShelfs; i++){
                let sliced = data.slice(i * 3, i * 3 + 3)
                dividedCassetteArr.push(sliced);
            }
            return dividedCassetteArr;
        });
    }, [data]);

    const displayRecordPopup = () => {
        setContent(<Recorder name={user.name} data={data} setData={setData}/>);
        popup.current.style.display = 'block';
    }

    const displayPlayerPopup = (voiceKey) => {
        setContent(<Player voiceKey={voiceKey}/>);
        popup.current.style.display = 'block';
    }

    const disappearPopup = () => {
        setContent(null);
        popup.current.style.display = 'none';
    }

    const invite = () => {
        console.log(window.localStorage.getItem("inviteURL"));
    }

    return (
        <div>
            <div className={"main-container"}>
                <div className={"main-title"}>
                    <p className={"user-info"}>{user.name}님에게 {data.length}개의 음성 편지가 도착했습니다!</p>
                    <p className={"user-guide"}>아이콘을 눌러 들어보세요~~</p>
                </div>
                <div className={"invite"}>
                    <button onClick={invite}>invite friends</button>
                </div>
                <div className={"main-shelves"}>
                    {cassettes.slice(offset, offset + 4).map((shelf, indexShelf) => {
                        return (
                            <div key={indexShelf} className={shelf.length < 3 ? "not-full-shelf" : "main-shelf"}>
                                {
                                    shelf.length !== 0
                                    ?
                                    shelf.map(({code, writer, iconType, fileUrl, date}) => {
                                        return (
                                            <Cassette key={code} nickname={writer} iconType={iconType} date={date} voiceFileKey={fileUrl} clickFunction={displayPlayerPopup}/>
                                        );
                                    })
                                    :
                                    <div className={"main-shelf"}>
                                        <div className={"empty-cassette"} />
                                        <div className={"empty-cassette"} />
                                        <div className={"empty-cassette"} />
                                    </div>
                                }
                            </div>
                        );
                    })}
                </div>
                <button onClick={displayRecordPopup}>record</button>
                <Popup id={"mainPopup"} className={"pop-up"} inner={content} innerRef={popup} disappearPopup={disappearPopup}/>
            </div>
        </div>
    );
}