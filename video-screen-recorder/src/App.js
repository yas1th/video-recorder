import { useState } from "react";
import "./App.css";
import { VideoRecorder } from "./components/video-recorder";
import { ScreenRecorder } from "./components/screen-recorder";
import { VIDEO, SCREEN } from "./constants";

function App() {
  const [selectedMedia, setSelectedMedia] = useState("");

  const handleMediaSelection = (evt) => {
    setSelectedMedia(evt.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video and Screen Recorder Application</h1>
        <label htmlFor="media">Select What you want to Record:</label>
        <select id="media" onChange={handleMediaSelection}>
          <option value={"choose-an-option"}>Choose an option</option>
          <option value={VIDEO}>Video</option>
          <option value={SCREEN}>Screen</option>
        </select>
        {selectedMedia === VIDEO && <VideoRecorder />}
        {selectedMedia === SCREEN && <ScreenRecorder />}
      </header>
    </div>
  );
}

export default App;
