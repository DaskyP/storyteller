import React from 'react';
import { useState, useEffect } from "react";
import PlayButton from "./PlayButton";
import StoryNarrator from "./StoryNarrator";
export default function StoryCard({ id, title, description, duration, category, content, onEdit, onDelete, registerCommand }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState({ title, description, duration, category, content });
  const [isPlaying, setIsPlaying] = useState(false);
  const [handleCommand, setHandleCommand] = useState(null); 

  useEffect(() => {
    if (registerCommand && handleCommand) {
      console.log(`📝 Registrando controlador de voz para: ${title} (ID: ${id})`);
      registerCommand(id, handleCommand);
    }else{
      console.log(`📝 No se pudo registrar controlador de voz para: ${title} (ID: ${id})`);
    }
  }, [handleCommand]);

  const handleChange = (e) => {
    setEditedStory({ ...editedStory, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onEdit(id, editedStory);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      {isEditing ? (
        <>
          <input className="w-full p-2 mb-2 text-black" name="title" value={editedStory.title} onChange={handleChange} />
          <textarea className="w-full p-2 mb-2 text-black" name="content" value={editedStory.content} onChange={handleChange} />
          <button className="bg-green-500 px-4 py-2 text-white rounded" onClick={handleSave}>Guardar</button>
          <button className="bg-gray-500 px-4 py-2 text-white rounded ml-2" onClick={() => setIsEditing(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-green-400">{title}</h2>
          <p className="text-gray-300">{description}</p>
          <p className="text-gray-400 mt-2">Duración: {duration}</p>
          <p className="text-gray-400 mt-2">Categoría: {category}</p>
          <p className="text-gray-200 mt-2">{content.substring(0, 100)}...</p>

          <StoryNarrator
            storyId={id}
            storyContent={content}
            onStatusChange={setIsPlaying}
            setHandleCommand={setHandleCommand} 
          />

          <div className="flex gap-2 mt-3">
            <PlayButton handleCommand={handleCommand} isPlaying={isPlaying} />
            <button className="bg-yellow-500 px-4 py-2 text-white rounded" onClick={() => setIsEditing(true)}>✏️ Editar</button>
            <button className="bg-red-500 px-4 py-2 text-white rounded" onClick={() => onDelete(id)}>🗑️ Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
}
