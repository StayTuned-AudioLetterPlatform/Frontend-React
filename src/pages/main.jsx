import React, {useEffect, useRef, useState} from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { expireTime as timeAtom, user as userAtom, records as recordsAtom } from "../states/atoms";
import styles from "../assets/css/main/main.module.css";
import '../assets/css/main/main.module.css';
import Cassette from "../components/cassette";
import Popup from "../components/popup";
import jwt_decode from "jwt-decode";
import Player from "../components/player";
import Invite from "../components/invite";
import axios from "axios";
import Crypto from "crypto-js";
import NameSelector from "../components/nameSelector";
import {useNavigate} from "react-router-dom";

export function Main() {
    const [user, setUser] = useRecoilState(userAtom); //store user data
    const [data, setData] = useRecoilState(recordsAtom); //voicemails(before processing)
    const [cassettes, setCassettes] = useState([]); //voicemails(after processing)
    const [offset, setOffset] = useState(0); //for pagination
    const [content, setContent] = useState(null); //for popup content
    const popup = useRef(); //referencing popup
    const navigate = useNavigate(); //for redirection

    const getCassetteAPI = async(url, header={}) => {
        try{
            const getCassetteData = await axios.get(url, header);
            //sort voicemail data
            getCassetteData.data.voicemailList.sort((a, b) => {
                return b.code - a.code;
            });
            //set voicemail state
            setData(getCassetteData.data.voicemailList);
            //set user state
            setUser({
                code: getCassetteData.data.userCode,
                isUser: getCassetteData.data.isUser,
                name: getCassetteData.data.userName
            });
        } catch (e) {
            alert(e + url);
            // navigate('/login');
        }
    };

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
        let decoded = {};
        if(token){
            //decode jwt token
            decoded = jwt_decode(token);

            //create random url
            let url = 'https://stay-tuned-frontend.vercel.app/main?userID=';
            //encrypt user ID
            const encryptedURL = Crypto.AES.encrypt(/*decoded.code.toString()*/'11', Crypto.enc.Utf8.parse(process.env.REACT_APP_SECRETKEY), {
                iv: Crypto.enc.Utf8.parse(process.env.REACT_APP_IV),
                padding: Crypto.pad.Pkcs7,
                mode: Crypto.mode.CBC
            });

            window.localStorage.setItem('inviteURL', url + encryptedURL.toString().replaceAll('+', '-').replaceAll('/', '_')); //query parameter로 변환

            const header = {
                "Authorization": "Bearer " + token,
            };

            //get cassette data name server : user
            getCassetteAPI('https://stay-tuned.shop/api/v1/voicemail/my', {headers: header});
        }
        else {
            //get cassette data name server : guest
            const queryParam = {userID: params.userID};
            const queryString = new URLSearchParams(queryParam).toString();
            getCassetteAPI('https://stay-tuned.shop/api/v1/voicemail/user?' + queryString);
        }


    }, []);
    //divide voicemails into array of 3 voicemail ( = shelf)
    useEffect(() => {
        setCassettes(() => {
            const numShelfs = data.length % 3 === 0 ? data.length / 3 : data.length / 3 + 1;
            const dividedCassetteArr = [];
            for(let i = 0; i < numShelfs; i++){
                let sliced = data.slice(i * 3, i * 3 + 3)
                dividedCassetteArr.push(sliced);
            }
            return dividedCassetteArr.slice(4*offset, (offset+1)*4);
        });
        console.log(cassettes);
    }, [data, offset]);
    //display recorder popup (record button click)
    const displayRecordPopup = () => {
        setContent(<NameSelector setContent={setContent} />)
        popup.current.style.display = 'flex';
    }
    //display player popup (cassette icon click)
    const displayPlayerPopup = (voiceKey) => {
        setContent(<Player voiceKey={voiceKey}/>);
        popup.current.style.display = 'flex';
    }
    //make popup disappear
    const disappearPopup = () => {
        setContent(null);
        popup.current.style.display = 'none';
    }
    //show invite popup
    const invite = () => {
        setContent(<Invite />);
        popup.current.style.display = 'flex';
    }
    //move to left shelf (offset - 1)
    const swipeLeft = () => {
        if(offset > 0){
            console.log(offset);
            setOffset(offset-1);
        }
    }
    //move to right shelf (offset + 1)
    const swipeRight = () => {
        if(offset < parseInt(cassettes.length / 4)){
            console.log(cassettes.length / 4);
            setOffset(offset + 1);
        }
    }

    return (
        <div>
            <div className={styles.mContainer}>
                <div className={styles.mainTitle}>
                    {user.isUser
                        ?
                        <div>
                            <p className={styles.userInfo}>{user.name}님에게 {data.length}개의 음성 편지가 도착했습니다!</p>
                            <p className={styles.userGuide}>아이콘을 눌러 들어보세요~~</p>
                        </div>
                        :
                        <div>
                            <p className={styles.userInfo}>{user.name}님에게 {data.length}개의 음성 편지가 도착했습니다!</p>
                            <p className={styles.userGuide}>{user.name}님에게 메시지를 남겨보세요~!</p>
                        </div>
                    }

                </div>
                <div className={styles.customButton}>
                    {user.isUser ? <div onClick={invite} className={styles.customButtonText}>invite friends</div> : null}
                </div>
                <div className={styles.shelves}>
                    <div className={styles.swipe} onClick={swipeLeft}>
                        <img src={"icons/right_arrow.png"} className={styles.swipeArrow}/>
                    </div>
                    <div className={styles.mShelves}>
                        {cassettes/*.slice(offset, offset + 4)*/.map((shelf, indexShelf) => {
                            return (
                                <div key={indexShelf} className={styles.mShelf}>
                                    {
                                        shelf.length !== 0
                                            ?
                                            shelf.map(({code, writer, iconType, fileUrl, date}) => {
                                                return (
                                                    <Cassette key={code} nickname={writer} iconType={iconType} date={date} clickFunction={user.isUser ? ()=>{displayPlayerPopup(fileUrl)} : null}/>
                                                );
                                            })
                                            :
                                            <div className={styles.mShelf}>
                                                <div className={styles.emptyCassette} />
                                                <div className={styles.emptyCassette} />
                                                <div className={styles.emptyCassette} />
                                            </div>
                                    }
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.swipe} onClick={swipeRight}>
                        <img src={"icons/left_arrow.png"} className={styles.swipeArrow} />
                    </div>
                </div>
                <div className={styles.customButton}>
                    {user.isUser ? null : <div onClick={displayRecordPopup} className={styles.customButtonText}>record</div>}
                </div>
                <Popup id={"mainPopup"} inner={content} innerRef={popup} disappearPopup={disappearPopup}/>
            </div>
        </div>
    );
}