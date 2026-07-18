import { createContext, useContext, useState } from "react";

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);

  const playTrack = (src, title) => {
    if (!src) {
      setCurrentTrack(null);
      return;
    }

    setCurrentTrack({ src, title });
  };

  const stopPlayer = () => {
    setCurrentTrack(null);
  };

  return (
    <AudioPlayerContext.Provider
      value={{ currentTrack, playTrack, stopPlayer }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }

  return context;
}
