const SoldBadge = ({ sold }) => (
    <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-100/90 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-orange-200 backdrop-blur-sm">
      {[...Array(3)].map((_, i) => (
        <svg key={i} className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ))}
      {sold}+ Sold
    </div>
  );

export default SoldBadge;