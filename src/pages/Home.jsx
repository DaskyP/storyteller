import Header from "../components/Header";
import VoiceControlButton from "../components/VoiceControlButton";
import CategoryFilter from "../components/CategoryFilter";
import StoryCard from "../components/StoryCard";

const stories = [
    {
      title: "El Principito",
      description: "Un clásico sobre un pequeño príncipe que viaja por diferentes planetas.",
      duration: "45 minutos",
      content: `Había una vez un pequeño príncipe que vivía en un asteroide llamado B-612...` 
    },
    {
      title: "La Sirenita",
      description: "Una hermosa historia sobre una sirena que sueña con vivir en el mundo terrestre.",
      duration: "30 minutos",
      content: `En el fondo del mar vivía una sirena que anhelaba conocer la tierra firme...`
    },
    {
      title: "El Patito Feo",
      description: "Un cuento sobre la aceptación y la transformación personal.",
      duration: "25 minutos",
      content: `En una granja nacieron varios patitos, pero uno de ellos era diferente...`
    },
    {
      title: "Caperucita Roja",
      description: "La clásica historia de una niña, su abuela y un lobo astuto.",
      duration: "20 minutos",
      content: `Érase una vez una niña llamada Caperucita Roja que vivía cerca de un gran bosque...`
    },
    {
      title: "Los Tres Cerditos",
      description: "Una historia sobre la importancia del trabajo bien hecho.",
      duration: "25 minutos",
      content: `Había tres cerditos que decidieron construir cada uno su casa...`
    },
    {
      title: "Hansel y Gretel",
      description: "Una aventura de dos hermanos en un bosque mágico.",
      duration: "35 minutos",
      content: `Hansel y Gretel eran dos hermanos que se perdieron en el bosque y encontraron una casa hecha de dulces...`
    },
    {
        title: "La Bella Durmiente",
        description: "Un cuento mágico sobre una princesa y una maldición.",
        duration: "40 minutos",
        content: `Había una vez un rey y una reina que anhelaban tener un hijo. Un día,PARTE 2 nació una hermosa princesa y se organizó un gran banquete en su honor. Se invitaron a todas las hadas del reino, excepto una, que se sintió ofendida y decidió lanzar una terrible maldición sobre la niña: "Cuando cumpla quince años, se pinchará el dedo con el huso de una rueca y morirá". 
      
      Sin embargo, una de las hadas que aún no había otorgado su don, suavizó la maldición diciendo: "No morirá, sino que caerá en un sueño profundo de cien años, hasta que un príncipe la despierte con un beso". 
      
      El rey, temeroso de la profecía, ordenó destruir todas las ruecas del reino, pero el destino no pudo evitarse. Cuando la princesa cumplió quince años, explorando el castillo, encontró una anciana que hilaba con una rueca. Curiosa, tocó el huso y, de inmediato, cayó en un profundo sueño. 
      
      El castillo entero quedó sumido en el mismo letargo. La maleza y espinas crecieron alrededor, formando una densa muralla que ocultó el palacio por años. Muchos caballeros intentaron atravesarla, pero ninguno tuvo éxito. 
      
      Después de un siglo, un valiente príncipe escuchó la leyenda y decidió intentarlo. Con gran esfuerzo, cruzó la barrera de espinas y encontró a la princesa dormida en su lecho. Maravillado por su belleza, se acercó y la besó suavemente. 
      
      En ese instante, la maldición se rompió, la princesa abrió los ojos y todo el castillo despertó con ella. El rey, la reina y los sirvientes volvieron a la vida como si el tiempo no hubiera pasado. 
      
      La princesa y el príncipe se enamoraron y pronto se casaron en una gran celebración. Así, el reino volvió a la alegría y prosperidad, y vivieron felices para siempre.`
      },
    {
      title: "El Gato con Botas",
      description: "Las astutas aventuras de un gato muy especial.",
      duration: "30 minutos",
      content: `Un gato muy astuto decidió ayudar a su amo a convertirse en alguien importante...`
    }
  ];
  
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-8 py-12">
      <Header />
      <VoiceControlButton />
      <CategoryFilter />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, index) => (
          <StoryCard key={index} {...story} />
        ))}
      </div>
    </div>
  );
}
