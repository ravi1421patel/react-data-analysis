import React from "react";

const ChartControls = ({ play, pause, stop, status }) => (
  <div style={{ marginBottom: "10px" }}>
    <button onClick={play} disabled={status === "playing"}>▶ Play</button>
    <button onClick={pause} disabled={status !== "playing"}>⏸ Pause</button>
    <button onClick={stop}>⏹ Stop</button>
  </div>
);

export default ChartControls;
