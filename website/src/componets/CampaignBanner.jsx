import React from "react";

const CampaignBanner = ({ data, loading }) => {
  if (loading) {
    return (
      <section className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-orange-100 animate-pulse h-20 rounded-2xl w-full border border-orange-200" />
      </section>
    );
  }

  if (!data || !data.isActive) return null;

  return (
    <section className="container mx-auto px-4 -mt-6 relative z-20">
      <div className="bg-linear-to-r from-orange-400 to-orange-500 rounded-2xl p-4 md:p-5 shadow-xl shadow-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">{data.emoji || "🎉"}</span>
          <div>
            <h3 className="text-white font-bold text-sm md:text-base">
              {data.title}
            </h3>
            <p className="text-orange-100 text-xs">{data.subtitle}</p>
          </div>
        </div>
        <a
          href={data.link || "/offers"}
          className="bg-white text-orange-500 px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-50 transition shadow-sm whitespace-nowrap"
        >
          {data.linkText || "View All Offers"} →
        </a>
      </div>
    </section>
  );
};

export default CampaignBanner;
