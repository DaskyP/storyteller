import { useState } from "react";
import Header from "../components/Header";
import VoiceControlButton from "../components/VoiceControlButton";
import CategoryFilter from "../components/CategoryFilter";
import StoryCard from "../components/StoryCard";
import stories from "../data/Stories";

export default function Home() {
  // 🔹 Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // 🔹 Filtrar cuentos según la categoría seleccionada
  const filteredStories = selectedCategory === "Todos"
    ? stories
    : stories.filter(story => story.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-8 py-12">
      <Header />
      <VoiceControlButton />
      
      {/* 🔥 Pasar el estado a CategoryFilter */}
      <CategoryFilter 
        categories={["Todos", "Para Dormir", "Diversión", "Educativos", "Aventuras"]}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* 🔹 Mostrar solo los cuentos filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story, index) => (
          <StoryCard key={index} {...story} />
        ))}
      </div>
    </div>
  );
}
