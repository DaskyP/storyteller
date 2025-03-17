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
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    content: "",
  });

  const storyCommandsRef = useRef({});

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setStories(response.data);
        console.log("📚 Historias cargadas:", response.data.map(s => s.title));
        setIsDataLoaded(true);
      })
      .catch((error) => console.error("❌ Error cargando cuentos:", error));
  }, []);

  useEffect(() => {
    storyCommandsRef.current = storyCommands;
    console.log("📌 Actualizando storyCommandsRef:", storyCommandsRef.current);
  }, [storyCommands]);

  // 🔹 Manejo de comandos de voz y botones
  const handlePlayCommand = (action, storyId = null) => {
    console.log("🎙️ Acción recibida:", action, "historia ID:", storyId || "N/A");
    console.log("📌 Estado actual de storyCommandsRef en handlePlayCommand:", storyCommandsRef.current);
  
    if (action === "pause" || action === "restart") {
      const playingStoryId = Object.keys(storyCommandsRef.current).find(id => {
        return typeof storyCommandsRef.current[id] === "function";
      });

      if (playingStoryId) {
        console.log(`⏸️ Acción ${action} en historia con ID: ${playingStoryId}`);
        storyCommandsRef.current[playingStoryId](action);
      } else {
        console.warn("⚠️ No hay ninguna historia en reproducción para ejecutar esta acción.");
      }
    } else if (action === "play") {
      if (storyId && storyCommandsRef.current[storyId]) {
        console.log(`▶️ Reproduciendo historia con ID: ${storyId}`);
        storyCommandsRef.current[storyId](action);
      } else {
        console.warn(`⚠️ No se encontró el controlador para esta historia con ID: ${storyId}`);
      }
    }
  };

  // 🔹 Registrar control de voz para cada historia
  const registerCommand = (id, handler) => {
    setStoryCommands(prev => {
      if (!handler || prev[id]) return prev; 
      console.log(`✅ Registrando comando para historia con ID: ${id}`);
      
      const updatedCommands = { ...prev, [id]: handler };
      console.log("📌 Nueva lista de storyCommands:", updatedCommands);
      return updatedCommands;
    });
  };

  // 🔹 Hook para reconocimiento de voz (ahora selecciona categorías correctamente)
  const { isListening, startListening, stopListening } = useVoiceCommands(
    isDataLoaded ? stories : [],
    handlePlayCommand,
    setSelectedCategory
  );

  // 🔹 Agregar una nueva historia
  const handleAddStory = () => {
    axios.post(API_URL, newStory)
      .then((response) => {
        setStories([...stories, response.data]);
        setNewStory({ title: "", description: "", duration: "", category: "", content: "" });
        console.log("✅ Historia agregada:", response.data);
      })
      .catch((error) => console.error("❌ Error agregando historia:", error));
  };

  // 🔹 Editar una historia
  const handleEditStory = (id, updatedStory) => {
    axios.put(`${API_URL}/${id}`, updatedStory)
      .then(() => {
        setStories(stories.map(story => (story.id === id ? { ...story, ...updatedStory } : story)));
        console.log(`✅ Historia actualizada: ${id}`);
      })
      .catch((error) => console.error("❌ Error actualizando la historia:", error));
  };

  // 🔹 Eliminar una historia
  const handleDeleteStory = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setStories(stories.filter(story => story.id !== id));
        console.log(`🗑️ Historia eliminada: ${id}`);
      })
      .catch((error) => console.error("❌ Error eliminando la historia:", error));
  };

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
          {/* 🔹 Filtro de categorías */}
          <CategoryFilter
            categories={["Todos", "Para Dormir", "Diversión", "Educativos", "Aventuras"]}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          {/* 🔹 Formulario para agregar historias */}
          <div className="bg-gray-700 p-6 rounded-lg my-6">
            <h2 className="text-xl text-white mb-4">Agregar Nueva Historia</h2>
            <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-black" placeholder="Título" value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} />
            <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-black" placeholder="Descripción" value={newStory.description} onChange={(e) => setNewStory({ ...newStory, description: e.target.value })} />
            <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-black" placeholder="Duración (min)" value={newStory.duration} onChange={(e) => setNewStory({ ...newStory, duration: e.target.value })} />
            <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-black" placeholder="Categoría" value={newStory.category} onChange={(e) => setNewStory({ ...newStory, category: e.target.value })} />
            <textarea className="w-full p-2 mb-2 border-4 border-white rounded-md text-black" placeholder="Contenido" value={newStory.content} onChange={(e) => setNewStory({ ...newStory, content: e.target.value })} />
            <button className="bg-blue-500 px-4 py-2 text-white rounded" onClick={handleAddStory}>Agregar Historia</button>
          </div>

          {/* 🔹 Lista de historias filtradas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories
              .filter(story => selectedCategory === "Todos" || story.category.toLowerCase() === selectedCategory.toLowerCase())
              .map((story) => (
                <StoryCard 
                  key={story.id} 
                  {...story} 
                  registerCommand={registerCommand} 
                  onEdit={handleEditStory}
                  onDelete={handleDeleteStory}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
