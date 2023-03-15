import { useState, useRef } from "react";
import axios from "axios";
const Recorder = (props) => {
    const mimeType = 'audio/wav'; //audio file format
    const [permission, setPermission] = useState(false); //has the user permission been given
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive"); //current recording status(recording, inactive, paused)
    const [stream, setStream] = useState(null);//stream object from MediaStream
    const [audioChunks, setAudioChunks] = useState([]); //encoded pieces of the recording
    const [audio, setAudio] = useState(null); //blob URL

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
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setAudioChunks([]);
            const soundFile = new File([audioUrl], "soundBlob", {lastModified: new Date().getTime(), type: "audio"});
            console.log(soundFile);
            //send
            const formData = new FormData();
            formData.append("mediaFile", soundFile);
            const send = async () => {
                await axios({
                    method: 'POST',
                    url: "http://172.30.1.32:8080/login",
                }).then(res => {
                    console.log(res);
                });
            };
            send();
        };
    };

    return (
        <div>
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
                        <button onClick={stopRecording} type="button">
                            Stop Recording
                        </button>
                    ) : null}
                </div>
                {audio ? (
                    <div className="audio-container">
                        <audio src={audio} controls></audio>
                        <a download href={audio}>
                            Download Recording
                        </a>
                    </div>
                ): null}
            </main>
        </div>
    );
};
export default Recorder;