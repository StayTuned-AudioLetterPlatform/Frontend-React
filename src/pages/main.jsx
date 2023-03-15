import React, {useState, useEffect, useRef} from 'react';
import '../assets/css/main.css';
import Cassette from "../components/cassette";
import Recorder from "../components/recorder";

export default function Main() {

    const [username, setUserName] = useState('temp');
    const [cassettes, setCassettes] = useState([]);
    let cassetteNum = useRef(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        //get cassette data name server
        const data = [
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
        ];
        cassetteNum.current = data.length;
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
    }, []);

    return (
        <div>
            <div className={"main-container"}>
                <div className={"main-title"}>
                    <p className={"user-info"}>{username}님에게 {cassetteNum.current}개의 음성 편지가 도착했습니다!</p>
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
                                            <Cassette key={id} nickname={nickname} iconType={iconType} voiceFileKey={voiceFileKey} date={date} />
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
                <Recorder name={username}/>
            </div>
        </div>
    );
}