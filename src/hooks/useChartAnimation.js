import { useState, useRef } from "react";

export const useChartAnimation = (maxIndex, onUpdate) => {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("stopped");
  const intervalRef = useRef(null);

  const play = () => {
    if (status === "playing") return;
    setStatus("playing");
    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        if (next >= maxIndex) {
          stop();
          return prev;
        }
        onUpdate(next);
        return next;
      });
    }, 3000);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setStatus("paused");
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIndex(0);
    setStatus("stopped");
    onUpdate(0);
  };

  return { index, status, play, pause, stop };
};
