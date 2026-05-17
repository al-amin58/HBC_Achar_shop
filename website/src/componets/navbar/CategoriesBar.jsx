const CategoryBar = ({ categories = [] }) => {
  return (
    <div className="bg-linear-to-r from-emerald-50 via-white to-orange-50 border-b border-emerald-100 hidden md:block relative z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat, idx) => (
            <a
              key={idx}
              href={cat.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 hover:text-orange-600 hover:bg-orange-50 transition whitespace-nowrap border border-transparent hover:border-orange-200"
            >
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
