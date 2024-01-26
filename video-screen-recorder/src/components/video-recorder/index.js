import "./index.css";
import { useRef, useState, useEffect } from "react";
import { VIDEO_BLOB_TYPE, VIDEO_STREAM_CONSTRAINTS } from "../../constants";

export const VideoRecorder = ({}) => {
  const webCamRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState();
  const [videoRecorder, setVideoRecorder] = useState();
  const [videoChunks, setVideoChunks] = useState([]);
  const [showRecordedVideo, setShowRecordedVideo] = useState(false);
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState();

  const handleStartRecording = () => {
    setIsRecording(true);
  };
  const handleStopRecording = () => {
    setIsRecording(false);
    // Stop all the tracks in the received
    // media stream i.e. close the camera and microphone
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
  };
  const handlePauseRecording = () => {
    videoRecorder.pause();
    setIsRecording(false);
  };
  const handleResumeRecording = () => {
    videoRecorder.resume();
    setIsRecording(true);
  };

  useEffect(() => {
    if (videoChunks?.length && !isRecording) {
      const videoBlob = new Blob(videoChunks, { type: VIDEO_BLOB_TYPE });
      setShowRecordedVideo(true);
      // creating a blob URL to set the src of video
      setRecordedVideoUrl(URL.createObjectURL(videoBlob));
      setShowDownloadLink(true);
    }
  }, [videoChunks]);

  useEffect(() => {
    if (showRecordedVideo) {
      // Setting created URL as source of the video or audio element
      recordedVideoRef.current.src = recordedVideoUrl;
      setVideoChunks([]);
    }
  }, [showRecordedVideo]);

  useEffect(() => {
    if (showDownloadLink) {
      // Set the download attribute to true so that
      // when user clicks on it video can be downloaded
      downloadLinkRef.current.download = "Recorded-Media";
      downloadLinkRef.current.href = recordedVideoUrl;
      downloadLinkRef.current.onClick = () => {
        /* To Avoid memory leaks revoking the createdURL
         */
        URL.revokeObjectURL(recordedVideoUrl);
        URL.revokeObjectURL(recordedVideoRef);
        // };
      };
    }
  }, [showDownloadLink]);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia(VIDEO_STREAM_CONSTRAINTS)
        .then((mediaStream) => {
          // Use the mediaStream in
          // your application
          // Make the mediaStream global
          const videoRecorder = new MediaRecorder(mediaStream);
          setMediaStream(mediaStream);
          setVideoRecorder(videoRecorder);
          webCamRef.current.srcObject = mediaStream;

          videoRecorder.start();

          // Whenever (here when the recorder
          // stops recording) data is available
          // the MediaRecorder emits a "dataavailable"
          // event with the recorded media data.
          videoRecorder.ondataavailable = (e) => {
            setVideoChunks([...videoChunks, e.data]);
          };
        })
        .catch((err) => {
          alert("You need to allow permissions to record the video");
        });
    }
  }, [isRecording]);

  return (
    <div className="video-recorder">
      <h3>Record Video</h3>
      <video autoPlay style={{ backgroundColor: "black" }} ref={webCamRef}>
        Your browser doesn't support the video tag
      </video>
      <div className="recording">
        Click the "Start video Recording" button to start recording
      </div>
      {/* This button will start the video recording */}
      <button onClick={handleStartRecording} disabled={isRecording}>
        Start video recording
      </button>
      {/* This button will stop the video recording */}
      <button disabled={!isRecording} onClick={handleStopRecording}>
        Stop video recording
      </button>
      <button disabled={!isRecording} onClick={handlePauseRecording}>
        Pause video recording
      </button>
      <button onClick={handleResumeRecording} disabled={isRecording}>
        Resume video recording
      </button>
      {showRecordedVideo && (
        <div>
          <h3>You can watch the below recorded video</h3>
          <video id="recorded-video" ref={recordedVideoRef} controls></video>
        </div>
      )}
      {showDownloadLink && (
        <div>
          <a href="" ref={downloadLinkRef}>
            Click here to download the video
          </a>
        </div>
      )}
      /** Adding watermarker using ffmpeg in node js is very much feasible
      Adding watermaker at client side will creating another hidden video with
      moving watermaker and then creating a blob for that stream to download it
      using node js also watermarker can be added */
      <p class="watermark-vid">Allen</p>
    </div>
  );
};
