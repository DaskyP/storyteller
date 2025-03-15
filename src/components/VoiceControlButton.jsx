import { FaMicrophone } from "react-icons/fa";

export default function VoiceControlButton() {
  return (
    <div className="flex justify-center my-6">
      <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg text-lg shadow-lg hover:bg-green-500">
        <FaMicrophone />
        Activar Control por Voz
      </button>
    </div>
  );
}
