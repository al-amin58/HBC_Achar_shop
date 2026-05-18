const CampaignBanner = ({ data, isVisible, onClose }) => {
  if (!isVisible || !data?.isActive) return null;

  const emoji = data.emoji || "🎉";
  const title = data.title?.trim() || "";
  const subtitle = "";
  const linkText = "";
  const href = data.link?.trim() || "/offers";

  const marqueeText = [emoji, title, subtitle, linkText ? `— ${linkText}` : ""]
    .filter(Boolean)
    .join(" ");

  if (!title && !subtitle && !linkText) return null;

  const content = (
    <div className="animate-marquee-scroll whitespace-nowrap flex items-center">
      {Array(8).fill(null).map((_, i) => (
        <span
          key={i}
          className="text-emerald-900 text-sm font-bold tracking-wide mx-8"
        >
          {marqueeText}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-b border-orange-100 z-30">
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "linear-gradient(90deg, #fdba74, #fde68a, #86efac, #fcd34d, #fdba74)",
          backgroundSize: "300% 100%",
        }}
      />

      <div className="relative flex items-center py-2.5 overflow-hidden">
        {href ? (
          <a href={href} className="block w-full hover:opacity-90 transition-opacity">
            {content}
          </a>
        ) : (
          content
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/40 rounded-full transition text-white z-10"
        aria-label="Close banner"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default CampaignBanner;
