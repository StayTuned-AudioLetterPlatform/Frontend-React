import { useState, useRef } from "react";
import axios from "axios";
import {user as userAtom, records as recordsAtom} from "../states/atoms";
import {useRecoilValue, useSetRecoilState} from "recoil";
import styles from '../assets/css/main/recorder.module.css';

const Recorder = (props) => {
    const mimeType = 'audio/wav'; //audio file format
    const [permission, setPermission] = useState(false); //has the user permission been given
    const mediaRecorder = useRef(null);
    const stopButton = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive"); //current recording status(recording, inactive, paused)
    const [stream, setStream] = useState(null);//stream object from MediaStream
    const [audioChunks, setAudioChunks] = useState([]); //encoded pieces of the recording
    const [audio, setAudio] = useState(null); //blob URL
    const userInfo = useRecoilValue(userAtom);
    const setRecords = useSetRecoilState(recordsAtom);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioStream = audioBlob.stream();
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioChunks([]);
            //send
            const url = `http://ec2-52-79-213-56.ap-northeast-2.compute.amazonaws.com:8080/api/v1/voicemail/file/upload/${userAtom.userCd}`;
            const formData = new FormData();
            formData.append("data", audioBlob);

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            axios.post(url, formData, config)
                .then((res) => {
                    console.log(res.data);
                    setAudio(res.data);
                    const tempaudio = res.data;
                    const saveData = new FormData();
                    saveData.append("fileUrl", tempaudio);
                    saveData.append("iconType", props.iconType);
                    saveData.append("targetUserCd", parseInt(userInfo.code));
                    saveData.append("writer", props.name);
                    const saveConfig = {
                        headers: {
                            'content-type': 'application/json'
                        }
                    };
                    axios.post("http://ec2-52-79-213-56.ap-northeast-2.compute.amazonaws.com:8080/api/v1/voicemail/save", saveData, saveConfig)
                        .then((res) => {
                            setRecords((prev)=> {
                                return([
                                    {
                                        code: res.data,
                                        writer: props.name,
                                        iconType: props.iconType,
                                        fileUrl: tempaudio,
                                    },
                                    ...prev
                                ]);
                            });
                        })
                        .catch((e) => {
                            console.log(e);
                        })
                })
                .catch((error) => {
                    console.log(error);
                });

        };
    };

    return (
        <div id={"recorder"}>
            <h2>Audio Recorder</h2>
            <main>
                <div className="audio-controls">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button">
                            Get Microphone
                        </button>
                    ) : null}
                    {permission && recordingStatus === "inactive" ? (
                        <button onClick={startRecording} type="button">
                            Start Recording
                        </button>
                    ) : null}
                    {recordingStatus === "recording" ? (
                        <button onClick={stopRecording} type="button" ref={stopButton}>
                            Stop Recording
                        </button>
                    ) : null}
                </div>
                {audio ? (
                    <div className="audio-container">
                        <audio src={audio} controls></audio>
                        {/*download 구현*/}
                        <a download={audio} />
                    </div>
                ): null}
            </main>
        </div>
    );
};
export default Recorder;