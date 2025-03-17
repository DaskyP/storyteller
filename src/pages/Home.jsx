import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import VoiceControlButton from "../components/VoiceControlButton";
import CategoryFilter from "../components/CategoryFilter";
import StoryCard from "../components/StoryCard";
import useVoiceCommands from "../hooks/useVoiceCommands";

const API_URL = "http://localhost:5000/cuentos"; 

export default function Home() {
  const [stories, setStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [storyCommands, setStoryCommands] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const storyCommandsRef = useRef({});

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setStories(response.data);
        console.log(" Historias cargadas:", response.data.map(s => s.title));
        setIsDataLoaded(true);
      })
      .catch((error) => console.error("❌ Error cargando cuentos:", error));
  }, []);

  useEffect(() => {
    storyCommandsRef.current = storyCommands;
    console.log("Actualizando storyCommandsRef:", storyCommandsRef.current);
  }, [storyCommands]);

  // 🔹 Manejo de comandos de voz y botones
  const handlePlayCommand = (action, storyId) => {
    console.log("Acción recibida:", action, "historia ID:", storyId);
    console.log("Estado actual de storyCommandsRef en handlePlayCommand:", storyCommandsRef.current);
  
    if (storyCommandsRef.current[storyId]) {
      storyCommandsRef.current[storyId](action);
    } else {
      console.warn(`No se encontró el controlador para esta historia con ID: ${storyId}`);
      console.log("Lista actual de storyCommandsRef:", storyCommandsRef.current);
    }
  };

  const registerCommand = (id, handler) => {
    setStoryCommands(prev => {
      if (!handler || prev[id]) return prev; 
      console.log(`Registrando comando para historia con ID: ${id}`);
      
      const updatedCommands = { ...prev, [id]: handler };
      console.log("Nueva lista de storyCommands:", updatedCommands);
      return updatedCommands;
    });
  };

  const { isListening, startListening, stopListening } = useVoiceCommands(
    isDataLoaded ? stories : [],
    handlePlayCommand,
    setSelectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-8 py-12">
      <Header />
      <VoiceControlButton 
        isListening={isListening} 
        startListening={startListening} 
        stopListening={stopListening} 
      />

      {stories.length === 0 ? (
        <p className="text-center text-gray-400">Cargando historias...</p>
      ) : (
        <>
          <CategoryFilter
            categories={["Todos", "Para Dormir", "Diversión", "Educativos", "Aventuras"]}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard 
                key={story.id} 
                {...story} 
                registerCommand={registerCommand} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
