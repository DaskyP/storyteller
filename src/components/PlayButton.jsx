import React from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

export default function PlayButton({ handleCommand, isPlaying }) {
  return (
    <div className="flex gap-2">
      <button
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
        onClick={() => handleCommand(isPlaying ? "pause" : "play")}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
        {isPlaying ? "Pausar" : "Reproducir"}
      </button>

      <button
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
        onClick={() => handleCommand("restart")}
      >
        <FaRedo />
        Reiniciar
      </button>
    </div>
  );
}
