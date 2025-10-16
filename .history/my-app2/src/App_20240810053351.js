import React from "react";
import ReactDOM from "react-dom";
import VideoPlayer from "./VideoPlayer"; // Assurez-vous que le chemin est correct

const App = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Lecteur de Vidéo en Streaming</h1>
      <VideoPlayer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
