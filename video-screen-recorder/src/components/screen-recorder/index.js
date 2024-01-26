import { useEffect, useState, useRef } from "react";
import {
  SCREEN_RECORDING_CONSTRAINTS,
  SCREEN_RECORDING_BLOB_TYPE,
} from "../../constants";

export const ScreenRecorder = ({}) => {
  const downloadLinkRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [screenRecorder, setScreenRecorder] = useState();
  const [screenRecordingChunks, setScreenRecordingChunks] = useState([]);
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState();

  const handleStartRecording = () => {
    setIsRecording(true);
  };
  const handleStopRecording = () => {
    setIsRecording(false);
    screenRecorder.stop();
  };

  useEffect(() => {
    if (screenRecordingChunks?.length && !isRecording) {
      const screenRecordingBlob = new Blob(screenRecordingChunks, {
        type: SCREEN_RECORDING_BLOB_TYPE,
      });
      // creating a blob URL to set the src of screen recording
      setRecordedVideoUrl(URL.createObjectURL(screenRecordingBlob));
      setShowDownloadLink(true);
    }
  }, [screenRecordingChunks]);

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
        // };
      };
    }
  }, [showDownloadLink]);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getDisplayMedia(SCREEN_RECORDING_CONSTRAINTS)
        .then((mediaStream) => {
          const screenRecorder = new MediaRecorder(mediaStream);
          setScreenRecorder(screenRecorder);

          screenRecorder.start();
          screenRecorder.ondataavailable = (e) => {
            setScreenRecordingChunks([...screenRecordingChunks, e.data]);
          };
        })
        .catch((err) => {
          alert("You need to allow permission to record the screen");
        });
    }
  }, [isRecording]);

  return (
    <div className="screen-recorder">
      <h3>Screen recording application</h3>
      <p>
        Please click on stop screen recording before stopping the screen sharing
      </p>
      <button onClick={handleStartRecording}>Start Screen Recording</button>
      <button onClick={handleStopRecording}>Stop Screen Recording</button>
      {showDownloadLink && (
        <div>
          <a href="" ref={downloadLinkRef}>
            Click here to download the screen recording
          </a>
        </div>
      )}
    </div>
  );
};
