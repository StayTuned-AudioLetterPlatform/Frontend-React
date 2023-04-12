import React, {useEffect, useRef, useState} from 'react';
import '../assets/css/main.css';
import Cassette from "../components/cassette";
import Recorder from "../components/recorder";
import Popup from "../components/popup";
import jwt_decode from "jwt-decode";

export default function Main() {

    const [user, setUser] = useState({
        code: 0,
        email: "temp",
        exp: "temp",
        iat: "temp",
        name: "temp",
    });
    const [data, setData] = useState([]);
    const [cassettes, setCassettes] = useState([]);
    const [offset, setOffset] = useState(0);
    const [tempAudio, setTempAudio] = useState("");
    const [content, setContent] = useState(null);
    const popup = useRef();

    var fragmentString = window.location.href.split('?')[1];
    setUser({
        code: fragmentString.code,
        email: fragmentString.email,
        exp: fragmentString.exp,
        iat: fragmentString.iat,
        name: fragmentString
    });


    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(fragmentString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    console.log(params);
    const token = params.access_token;
    const decoded = jwt_decode(token);

    console.log(decoded);

    useEffect(() => {
        //get cassette data name server
        setData([
            {
                id: 'temp1',
                nickname: 'temp1',
                iconType: 'temp1',
                voiceFileKey: 'temp1',
                date: new Date('2023-03-07T03:24:00'),
            },
            {
                id: 'temp2',
                nickname: 'temp2',
                iconType: 'temp2',
                voiceFileKey: 'temp2',
                date: new Date('2023-03-07T03:25:00'),
            },
            {
                id: 'temp3',
                nickname: 'temp3',
                iconType: 'temp3',
                voiceFileKey: 'temp3',
                date: new Date('2023-03-07T03:26:00'),
            },
            {
                id: 'temp4',
                nickname: 'temp4',
                iconType: 'temp4',
                voiceFileKey: 'temp4',
                date: new Date('2023-03-07T03:21:00'),
            },
            {
                id: 'temp5',
                nickname: 'temp5',
                iconType: 'temp5',
                voiceFileKey: 'temp5',
                date: new Date('2023-03-06T03:24:00'),
            },
            {
                id: 'temp6',
                nickname: 'temp6',
                iconType: 'temp6',
                voiceFileKey: 'temp6',
                date: new Date('2022-03-07T03:24:00'),
            },
            {
                id: 'temp7',
                nickname: 'temp7',
                iconType: 'temp7',
                voiceFileKey: 'temp7',
                date: new Date('2023-03-07T03:24:02'),
            },
            {
                id: 'temp8',
                nickname: 'temp8',
                iconType: 'temp8',
                voiceFileKey: 'temp8',
                date: new Date('2013-03-17T03:24:00'),
            },
        ]);
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

    const displayPlayerPopup = () => {
        setContent(<div>djklslehfjkf</div>);
        popup.current.style.display = 'block';
    }

    const disappearPopup = () => {
        setContent(null);
        popup.current.style.display = 'none';
    }

    return (
        <div>
            <div className={"main-container"}>
                <div className={"main-title"}>
                    <p className={"user-info"}>{user.name}님에게 {data.length}개의 음성 편지가 도착했습니다!</p>
                    <p className={"user-guide"}>아이콘을 눌러 들어보세요~~</p>
                </div>
                <div className={"main-shelves"}>
                    {cassettes.slice(offset, offset + 4).map((shelf, indexShelf) => {
                        return (
                            <div key={indexShelf} className={"main-shelf"}>
                                {
                                    shelf.length !== 0
                                    ?
                                    shelf.map(({id, nickname, iconType, voiceFileKey, date}) => {
                                        return (
                                            <Cassette key={id} nickname={nickname} iconType={iconType} voiceFileKey={voiceFileKey} date={date}/>
                                        );
                                    })
                                    :
                                    <div className={"main-shelf"}>
                                        <Cassette nickname={null} iconType={null} voiceFileKey={null} date={null} />
                                        <Cassette nickname={null} iconType={null} voiceFileKey={null} date={null} />
                                        <Cassette nickname={null} iconType={null} voiceFileKey={null} date={null} />
                                    </div>
                                }
                            </div>
                        );
                    })}
                </div>
                <button onClick={displayPlayerPopup}>play</button>
                <div className="temp">
                    <audio src={tempAudio} controls></audio>
                </div>
                <button onClick={displayRecordPopup}>record</button>
                <Popup id={"mainPopup"} className={"pop-up"} inner={content} innerRef={popup} disappearPopup={disappearPopup}/>
                {/*<Recorder name={username} data={data} setData={setData}/>*/}
            </div>
        </div>
    );
}