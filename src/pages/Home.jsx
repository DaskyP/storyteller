import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import VoiceControlButton from "../components/VoiceControlButton";
import CategoryFilter from "../components/CategoryFilter";
import StoryCard from "../components/StoryCard";

const API_URL = "http://localhost:5000/cuentos"; // URL del backend

export default function Home() {
  const [stories, setStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    content: "",
  });

  // 🔹 Cargar cuentos desde la API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setStories(response.data))
      .catch((error) => console.error("Error cargando cuentos:", error));
  }, []);

  // 🔹 Función para agregar un cuento
  const handleAddStory = () => {
    axios.post(API_URL, newStory)
      .then((response) => {
        setStories([...stories, response.data]);
        setNewStory({ title: "", description: "", duration: "", category: "", content: "" });
      })
      .catch((error) => console.error("Error agregando cuento:", error));
  };

  // 🔹 Función para actualizar un cuento
  const handleEditStory = (id, updatedStory) => {
    axios.put(`${API_URL}/${id}`, updatedStory)
      .then(() => {
        setStories(stories.map((story) => (story.id === id ? { ...story, ...updatedStory } : story)));
      })
      .catch((error) => console.error("Error actualizando el cuento:", error));
  };

  // 🔹 Función para eliminar un cuento
  const handleDeleteStory = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setStories(stories.filter((story) => story.id !== id));
      })
      .catch((error) => console.error("Error eliminando el cuento:", error));
  };

  // 🔹 Filtrar cuentos por categoría
  const filteredStories = selectedCategory === "Todos"
    ? stories
    : stories.filter(story => story.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-8 py-12">
      <Header />
      <VoiceControlButton />
      
      {/* 🔹 Filtro de categorías */}
      <CategoryFilter
        categories={["Todos", "Para Dormir", "Diversión", "Educativos", "Aventuras"]}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* 🔹 Formulario para agregar cuentos */}
      <div className="bg-gray-700 p-6 rounded-lg my-6">
        <h2 className="text-xl text-white mb-4">Agregar Nuevo Cuento</h2>
        <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-white" placeholder="Título" value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} />
        <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-white" placeholder="Descripción" value={newStory.description} onChange={(e) => setNewStory({ ...newStory, description: e.target.value })} />
        <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-white" placeholder="Duración" value={newStory.duration} onChange={(e) => setNewStory({ ...newStory, duration: e.target.value })} />
        <input className="w-full p-2 mb-2 border-4 border-white rounded-md text-white" placeholder="Categoría" value={newStory.category} onChange={(e) => setNewStory({ ...newStory, category: e.target.value })} />
        <textarea className="w-full p-2 mb-2 border-4 border-white rounded-md text-white" placeholder="Contenido" value={newStory.content} onChange={(e) => setNewStory({ ...newStory, content: e.target.value })} />
        <button className="bg-blue-500 px-4 py-2 text-white rounded" onClick={handleAddStory}>Agregar Cuento</button>
      </div>

      {/* 🔹 Lista de cuentos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <StoryCard 
            key={story.id} 
            {...story} 
            onEdit={handleEditStory} 
            onDelete={handleDeleteStory} 
          />
        ))}
      </div>
    </div>
  );
}
