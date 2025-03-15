import { useState } from "react";
import StoryNarrator from "./StoryNarrator";
import PlayButton from "./PlayButton";

export default function StoryCard({ title, description, duration, content }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [handleCommand, setHandleCommand] = useState(() => () => {});

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-green-400">{title}</h2>
      <p className="text-gray-300">{description}</p>
      <p className="text-gray-400 mt-2">Duración: {duration}</p>

      <StoryNarrator
        storyId={title} // 🔥 Pasamos el título como ID único para guardar la posición
        storyContent={content}
        onStatusChange={setIsPlaying}
        setHandleCommand={setHandleCommand}
      />

      <PlayButton handleCommand={handleCommand} isPlaying={isPlaying} />
    </div>
  );
}
