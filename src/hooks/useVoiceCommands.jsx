import { useEffect, useState, useRef } from "react";

export default function useVoiceCommands(stories, handleVoiceCommand, setSelectedCategory) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("❌ Tu navegador no soporta la Web Speech API.");
      return;
    }

    if (stories.length === 0) {
      console.log("⏳ Esperando historias antes de activar reconocimiento de voz...");
      return; 
    }

    console.log("📚 Lista de historias en memoria:", stories.map(story => story.title));

    if (!recognitionRef.current) { 
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = "es-ES";
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log("🎙️ Reconocimiento de voz activado...");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log("🛑 Reconocimiento de voz detenido.");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("🗣️ Comando detectado:", transcript);

        const normalizeText = (text) => 
          text
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/\s+/g, " "); 

        console.log("Lista de historias en memoria:", stories.map(story => normalizeText(story.title)));

        if (transcript.startsWith("reproduce")) {
          const storyName = normalizeText(transcript.replace("reproduce", "").trim());
          console.log(`Buscando historia con nombre: "${storyName}"`);

          const foundStory = stories.find(story => 
            normalizeText(story.title) === storyName
          );

          if (foundStory) {
            console.log(`Historia encontrada: "${foundStory.title}"`);
            handleVoiceCommand("play", foundStory.id);
          } else {
            console.log("No se encontró la historia.");
          }
        } else if (transcript.includes("pausar")) {
          handleVoiceCommand("pause");
        } else if (transcript.includes("reiniciar")) {
          handleVoiceCommand("restart");
        } else if (transcript.includes("seleccionar categoría")) {
          const category = normalizeText(transcript.replace("seleccionar categoría", "").trim());
          console.log(`Seleccionando categoría: ${category}`);
          setSelectedCategory(category);
        }
      };
    }
  }, [stories]);

  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return { isListening, startListening, stopListening };
}
