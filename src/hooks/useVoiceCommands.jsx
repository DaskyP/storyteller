import React from 'react';
import { useEffect, useState, useRef } from "react";
export default function useVoiceCommands(stories, handleVoiceCommand, setSelectedCategory) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis; 

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Tu navegador no soporta la Web Speech API.");
      return;
    }

    if (stories.length === 0) {
      console.log("Esperando historias antes de activar reconocimiento de voz...");
      return; 
    }

    console.log("Lista de historias en memoria:", stories.map(story => story.title));

    if (!recognitionRef.current) { 
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = "es-ES";
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log("Reconocimiento de voz activado...");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log("Reconocimiento de voz detenido.");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("Comando detectado:", transcript);

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
          
          const validCategories = ["todos", "para dormir", "diversión", "educativos", "aventuras"];
          
          if (validCategories.includes(category)) {
            console.log(`Seleccionando categoría: ${category}`);
            setSelectedCategory(category.charAt(0).toUpperCase() + category.slice(1)); 
          } else {
            console.warn("Categoría no válida:", category);
          }
        }
      };
    }
  }, [stories, setSelectedCategory]); 

  useEffect(() => {
    const showCommands = (event) => {
      if (event.key.toLowerCase() === "z") {
        const commandsList = [
          "Lista de Comandos Disponibles:",
          "Di 'Reproduce [nombre de la historia]' para iniciar una historia.",
          "Di 'Pausar' para pausar la historia en reproducción.",
          "Di 'Reiniciar' para reiniciar la historia desde el inicio.",
          "Di 'Seleccionar categoría [nombre]' para filtrar historias por categoría.",
        ];

        console.log(commandsList.join("\n")); 

        speakTextInChunks(commandsList);
      }
    };

    document.addEventListener("keydown", showCommands);
    return () => {
      document.removeEventListener("keydown", showCommands);
    };
  }, []);

  const speakTextInChunks = (textArray) => {
    if (!("speechSynthesis" in window)) {
      console.warn("Tu navegador no soporta la síntesis de voz.");
      return;
    }

    if (synth.speaking) {
      console.log("Narrador ocupado, esperando...");
      return;
    }

    let fullText = textArray.join(" "); 
    const words = fullText.split(" ");
    const chunks = [];

    for (let i = 0; i < words.length; i += 10) {
      chunks.push(words.slice(i, i + 10).join(" ")); 
    }

    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        if (!synth.speaking) { 
          const utterance = new SpeechSynthesisUtterance(chunk);
          utterance.lang = "es-ES";
          utterance.rate = 1;
          synth.speak(utterance);
        }
      }, index * 2000); 
    });
  };

  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return { isListening, startListening, stopListening,  registerCommand: () => {}  };
}
