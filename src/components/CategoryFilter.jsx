export default function CategoryFilter() {
    const categories = ["Para Dormir", "Diversión", "Educativos", "Aventuras"];
  
    return (
      <div className="flex justify-center gap-4 mb-6">
        {categories.map((category, index) => (
          <button key={index} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500">
            {category}
          </button>
        ))}
      </div>
    );
  }
  