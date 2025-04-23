import React from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

export default function VoiceControlButton({ isListening, startListening, stopListening }) {
  if (!startListening || !stopListening) {
    console.error("Error: No se pasaron correctamente las funciones startListening y stopListening.");
    return null;
  }

  return (
    <div className="flex justify-center my-6">
      <button
        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-lg shadow-lg ${
          isListening ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"
        } text-white`}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        {isListening ? "Desactivar Voz" : "Activar Control por Voz"}
      </button>
    </div>
  );
}
