export default function CategoryFilter({ categories, setSelectedCategory, selectedCategory }) {
    return (
      <div className="flex justify-center space-x-4 my-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedCategory === category ? "bg-green-500" : "bg-green-700 hover:bg-green-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }
  