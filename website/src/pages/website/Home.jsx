import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ProductCard from "../../componets/ProductCard.jsx";
import CountdownTimer from "../../componets/CountdownTimer.jsx";
import CampaignBanner from "../../componets/CampaignBanner.jsx";
import api from "../../api/axios.js";

const formatCouponDiscount = (coupon, t) => {
  if (!coupon) return "";
  if (coupon.type === "percentage") return t('home.discountPercent', { value: coupon.value });
  return t('home.discountFlat', { value: coupon.value });
};

/* Loading Skeleton */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-emerald-100 overflow-hidden animate-pulse">
    <div className="bg-emerald-50 aspect-square" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-emerald-100 rounded w-3/4" />
      <div className="h-3 bg-emerald-100 rounded w-1/2" />
      <div className="h-8 bg-emerald-100 rounded mt-3" />
    </div>
  </div>
);

const SectionSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/* Empty State */
const EmptySection = ({ msg }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-10 text-emerald-400 text-sm">{msg || t('home.noProducts')}</div>
  );
};

/* MAIN HOME COMPONENT */
const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCatTab, setActiveCatTab] = useState(0);
  const flashScrollRef = useRef(null);
  const [featuredCoupon, setFeaturedCoupon] = useState(null);

  // API state
  const [homeData, setHomeData] = useState({
    flashSaleEndsAt: null,
    flashSaleProducts: [],
    heroSlides: [],
    campaignBanner: null,
    ads: [],
    featuredProducts: [],
    newArrivals: [],
    bestSelling: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch home data
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await api.get("/home");
        // Merge with previous state to preserve default empty arrays if API keys are missing
        setHomeData((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Home data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);

  useEffect(() => {
    const fetchFeaturedCoupon = async () => {
      try {
        const res = await api.get("/coupons/active");
        const list = Array.isArray(res.data) ? res.data : [];
        setFeaturedCoupon(list[0] || null);
      } catch {
        setFeaturedCoupon(null);
      }
    };
    fetchFeaturedCoupon();
  }, []);

  const handleCollectCoupon = () => {
    if (!featuredCoupon?.code) return;
    navigate(`/checkout?coupon=${encodeURIComponent(featuredCoupon.code)}`);
  };

  const heroSlideCount = homeData.heroSlides?.length ?? 0;

  // Reset slide index when slides change from API
  useEffect(() => {
    setCurrentSlide(0);
  }, [heroSlideCount]);

  // Auto-slide hero
  useEffect(() => {
    if (heroSlideCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlideCount]);

  const scrollFlash = (dir) => {
    if (flashScrollRef.current) {
      flashScrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  const {
    flashSaleEndsAt,
    flashSaleProducts = [],
    featuredProducts = [],
    newArrivals = [],
    bestSelling = [],
    heroSlides = [],
    campaignBanner,
    ads = [],
  } = homeData;

  return (
    <div className="min-h-screen bg-emerald-50/30">
      {/* 1️⃣ HERO SLIDER */}
      <section className="relative h-75 sm:h-100 md:h-125 overflow-hidden">
        {heroSlides.length > 0 ? (
          heroSlides.map((slide, idx) => (
            <div
              key={slide._id || slide.id || slide.tempId || idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-r ${slide.color} z-10`}
              />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-xl animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-emerald-100 text-sm sm:text-base md:text-lg mb-6 drop-shadow">
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.link}
                      className="inline-flex items-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-full font-bold hover:bg-orange-400 hover:text-white transition shadow-lg"
                    >
                      {slide.cta}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : loading ? (
          <div className="absolute inset-0 bg-emerald-100 animate-pulse" />
        ) : null}
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.length > 1 &&
            heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"}`}
              />
            ))}
        </div>
      </section>

      {/* 2️⃣ CAMPAIGN BANNER */}
      <CampaignBanner data={campaignBanner} loading={loading} />

      {/* 3️⃣ ACHAR JAR QUICK ACCESS */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <span className="w-1.5 h-7 bg-orange-400 rounded-full"></span>
            {t('home.quickAccess')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* 🫙 JAR 1: Coupon Collect */}
          <div className="group relative flex flex-col items-center">
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-amber-900/30"></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-amber-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-gradient-to-b from-amber-900 to-amber-950 rounded-b-sm"></div>
            </div>
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-gradient-to-b from-emerald-100/80 to-white/90 border-x border-emerald-200/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="relative z-10 w-[75%] h-3 bg-gradient-to-b from-white to-emerald-50/50 rounded-t-[40%] border-t border-emerald-100/50"></div>
            <div className="relative -mt-1 w-full aspect-[0.8] bg-gradient-to-b from-emerald-50/20 via-white to-emerald-50/30 rounded-[40%] border-2 border-emerald-100/80 group-hover:border-orange-300/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-100/30 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-8 left-6 w-2 h-10 bg-white/30 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-6 right-2 w-6 h-24 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-amber-900/20 via-amber-800/10 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-orange-900/15 via-amber-800/10 to-transparent z-10"></div>
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-gradient-to-b from-emerald-400/90 via-emerald-500/95 to-emerald-600/90 rounded-[30%] border border-emerald-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                <div className="relative flex-1 pb-10 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">🎟️</span>
                  </div>
                  <h3 className="text-white font-bold sm:text-2xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    {t('home.coupon')}
                  </h3>
                  <p className="text-emerald-100 sm:text-xl text-2xl font-medium mb-2">
                    {t('home.collectCoupon')}
                  </p>
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  <div className="bg-white/90 rounded-full px-3 py-1 shadow-md mb-2">
                    <p className="text-emerald-700 sm:text-[15px] text-[20px] font-extrabold">
                      {featuredCoupon ? formatCouponDiscount(featuredCoupon, t) : "—"}
                    </p>
                  </div>
                  <p className="text-emerald-100 sm:text-[15px] text-[20px] mb-2 tracking-wider">
                    {featuredCoupon ? t('home.code', { code: featuredCoupon.code }) : t('home.noCoupon')}
                  </p>
                  <button
                    type="button"
                    onClick={handleCollectCoupon}
                    disabled={!featuredCoupon}
                    className="w-full py-1.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white sm:text-[15px] text-[20px] cursor-pointer font-bold rounded-full hover:from-orange-500 hover:to-amber-600 transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('home.getCoupon')}
                  </button>
                </div>
              </div>
            </div>
            <div className="relative -mt-2 w-[70%] h-4 bg-gradient-to-b from-emerald-100/40 to-emerald-200/20 rounded-[50%] shadow-sm"></div>
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>

          {/* 🫙 JAR 2: Order Track */}
          <div className="group relative flex flex-col items-center">
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 h-full bg-emerald-900/30"
                    ></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-emerald-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-gradient-to-b from-emerald-900 to-emerald-950 rounded-b-sm"></div>
            </div>
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-gradient-to-b from-emerald-100/80 to-white/90 border-x border-emerald-200/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="relative z-10 w-[75%] h-3 bg-gradient-to-b from-white to-emerald-50/50 rounded-t-[40%] border-t border-emerald-100/50"></div>
            <div className="relative -mt-1 w-full aspect-[0.8] bg-gradient-to-b from-emerald-50/20 via-white to-emerald-50/30 rounded-[40%] border-2 border-emerald-100/80 group-hover:border-emerald-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-100/30 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-6 right-2 w-6 h-24 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-emerald-900/15 via-emerald-800/10 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-emerald-900/12 via-teal-800/8 to-transparent z-10"></div>
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-gradient-to-b from-teal-400/90 via-emerald-500/95 to-emerald-600/90 rounded-[30%] border border-emerald-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                <div className="relative flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">📦</span>
                  </div>
                  <h3 className="text-white font-bold sm:text-xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    {t('home.order')}
                  </h3>
                  <p className="text-emerald-100 sm:text-[15px] text-[20px] font-medium mb-2">
                    {t('home.track')}
                  </p>
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  <div className="flex items-center gap-1 justify-center mb-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-4 h-0.5 bg-white/50"></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                    <div className="w-4 h-0.5 bg-white/30"></div>
                    <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                  </div>
                  <p className="text-emerald-100 sm:text-[15px] text-[20px] mb-2">
                    {t('home.onDelivery')}
                  </p>
                  <a
                    href="/track-order"
                    className="w-full py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white sm:text-[15px] text-[20px] font-bold rounded-full hover:from-emerald-500 hover:to-teal-600 transition shadow-md active:scale-95 text-center block"
                  >
                    {t('home.track')}
                  </a>
                </div>
              </div>
            </div>
            <div className="relative -mt-2 w-[70%] h-4 bg-gradient-to-b from-emerald-100/40 to-emerald-200/20 rounded-[50%] shadow-sm"></div>
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>

          {/* 🫙 JAR 3: Flash Sale */}
          <div className="group relative flex flex-col items-center">
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-gradient-to-b from-red-700 via-red-800 to-red-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-red-900/30"></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-red-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-gradient-to-b from-red-900 to-red-950 rounded-b-sm"></div>
            </div>
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-gradient-to-b from-red-50/80 to-white/90 border-x border-red-100/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="relative z-10 w-[75%] h-3 bg-gradient-to-b from-white to-red-50/50 rounded-t-[40%] border-t border-red-100/50"></div>
            <div className="relative -mt-1 w-full aspect-[0.8] bg-gradient-to-b from-red-50/20 via-white to-orange-50/30 rounded-[40%] border-2 border-red-100/80 group-hover:border-red-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-100/30 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-6 right-2 w-6 h-24 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-red-900/20 via-red-800/10 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-red-900/15 via-orange-800/10 to-transparent z-10"></div>
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-gradient-to-b from-orange-400/90 via-red-500/95 to-red-600/90 rounded-[30%] border border-red-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                <div className="relative flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">🔥</span>
                  </div>
                  <h3 className="text-white font-bold sm:text-xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    {t('home.flashSale')}
                  </h3>
                  <p className="text-red-100 sm:text-[15px] text-[20px] font-medium mb-2">
                    সেল চলছে
                  </p>
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  <div className="flex justify-center gap-1 mb-2">
                    {["০২", "৪৫", "৩০"].map((time, i) => (
                      <span
                        key={i}
                        className="bg-white/90 text-red-600 sm:text-[15px] text-[20px] font-bold px-1 py-0.5 rounded"
                      >
                        {time}
                        {i < 2 && ":"}
                      </span>
                    ))}
                  </div>
                  <p className="text-red-100 sm:text-[15px] text-[20px] mb-2">
                    {t('home.flashEnding')}
                  </p>
                  <a
                    href="/flash-sale"
                    className="w-full py-1.5 bg-gradient-to-r from-red-400 to-orange-500 text-white sm:text-[15px] text-[20px] font-bold rounded-full hover:from-red-500 hover:to-orange-600 transition shadow-md active:scale-95 text-center block"
                  >
                    কিনুন
                  </a>
                </div>
              </div>
            </div>
            <div className="relative -mt-2 w-[70%] h-4 bg-gradient-to-b from-red-100/40 to-red-200/20 rounded-[50%] shadow-sm"></div>
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>

          {/* 🫙 JAR 4: Support */}
          <div className="group relative flex flex-col items-center">
            <div className="relative z-30 w-[65%]">
              <div className="h-3 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 rounded-t-full shadow-md"></div>
              <div className="h-5 bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 flex justify-around items-center">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-0.5 h-full bg-blue-900/30"></div>
                  ))}
                </div>
                <div className="absolute top-0.5 left-1/4 w-1/2 h-1 bg-blue-500/40 rounded-full"></div>
              </div>
              <div className="h-1.5 bg-gradient-to-b from-blue-900 to-blue-950 rounded-b-sm"></div>
            </div>
            <div className="relative z-20 w-[50%]">
              <div className="h-4 bg-gradient-to-b from-blue-50/80 to-white/90 border-x border-blue-100/30 relative">
                <div className="absolute right-1 top-0 w-1 h-full bg-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="relative z-10 w-[75%] h-3 bg-gradient-to-b from-white to-blue-50/50 rounded-t-[40%] border-t border-blue-100/50"></div>
            <div className="relative -mt-1 w-full aspect-[0.8] bg-gradient-to-b from-blue-50/20 via-white to-indigo-50/30 rounded-[40%] border-2 border-blue-100/80 group-hover:border-blue-400/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-100/30 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-4 left-3 w-4 h-20 bg-white/40 rounded-full blur-[1px] transform rotate-6 z-20"></div>
              <div className="absolute top-6 right-2 w-6 h-24 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[2px] transform -rotate-12 z-20"></div>
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-blue-900/15 via-indigo-800/10 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-blue-900/12 via-indigo-800/8 to-transparent z-10"></div>
              <div className="absolute top-[12%] left-[6%] right-[6%] bottom-[12%] bg-gradient-to-b from-blue-400/90 via-indigo-500/95 to-blue-600/90 rounded-[30%] border border-blue-400/50 shadow-inner overflow-hidden z-10 flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
                <div className="relative flex-1 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-20 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                    <span className="text-lg">💬</span>
                  </div>
                  <h3 className="text-white font-bold sm:text-xl text-3xl leading-tight mb-0.5 drop-shadow-md">
                    {t('home.support')}
                  </h3>
                  <p className="text-blue-100 sm:text-[15px] text-[20px] font-medium mb-2">
                    {t('home.support247')}
                  </p>
                  <div className="w-full h-px bg-white/30 mb-2"></div>
                  <div className="bg-white/90 rounded-full px-3 py-1 shadow-md mb-2">
                    <p className="text-blue-600 sm:text-[15px] text-[20px] font-bold">
                      {t('home.reply2min')}
                    </p>
                  </div>
                  <p className="text-blue-100 sm:text-[15px] text-[20px] mb-2">
                    {t('home.chatNow')}
                  </p>
                  <a
                    href="/support"
                    className="w-full py-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 text-white sm:text-[15px] text-[20px] font-bold rounded-full hover:from-blue-500 hover:to-indigo-600 transition shadow-md active:scale-95 text-center block"
                  >
                    {t('home.chat')}
                  </a>
                </div>
              </div>
            </div>
            <div className="relative -mt-2 w-[70%] h-4 bg-gradient-to-b from-blue-100/40 to-blue-200/20 rounded-[50%] shadow-sm"></div>
            <div className="w-[80%] h-2 bg-black/5 rounded-[50%] mt-1 blur-sm"></div>
          </div>
        </div>
      </section>

      {/* 4️⃣ FLASH SALE SECTION */}
      <section className="py-10 md:py-14 border-y border-orange-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">⚡</span>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-red-600">
                  {t('home.flashSale')}
                </h2>
                <p className="text-xs text-red-400 font-medium">
                  {t('home.flashSaleHint')}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-5 w-full sm:w-auto">
              <div className="w-full sm:w-auto sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-red-100 shadow-sm">
                <span className="text-xl font-bold text-red-500 uppercase">
                  {t('home.endsIn')}
                </span>
                <CountdownTimer endTime={flashSaleEndsAt} />
              </div>
              <div className="hidden sm:flex gap-1">
                <button
                  onClick={() => scrollFlash(-1)}
                  className="w-8 h-8 rounded-full bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => scrollFlash(1)}
                  className="w-8 h-8 rounded-full bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col sm:flex-row gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full sm:min-w-70">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : flashSaleProducts.length === 0 ? (
            <EmptySection msg={t('home.noFlashSale')} />
          ) : (
            <div
              ref={flashScrollRef}
              className="flex flex-col sm:flex-row gap-4 sm:overflow-x-auto pb-2 sm:snap-x sm:snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {flashSaleProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full sm:min-w-70 sm:snap-start"
                >
                  <ProductCard product={product} flashSale />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5️⃣ FEATURED PRODUCTS */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <span className="w-1.5 h-7 bg-orange-400 rounded-full"></span>
            {t('home.featuredProducts')}
          </h2>
          <a
            href="/shop"
            className="text-sm text-orange-500 font-bold hover:text-orange-600 transition"
          >
            {t('home.viewAll')}
          </a>
        </div>
        {loading ? (
          <SectionSkeleton />
        ) : featuredProducts.length === 0 ? (
          <EmptySection />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6️⃣ ADS SECTION */}
      <section className="container mx-auto px-4 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? [1, 2].map((i) => (
                <div
                  key={i}
                  className="h-48 md:h-56 bg-emerald-100 animate-pulse rounded-2xl"
                />
              ))
            : ads.length === 0 ? null
            : ads.map((ad, idx) => (
                <a
                  href={ad.link || "#"}
                  key={idx}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${ad.color || "from-emerald-800/90 to-emerald-600/70"} z-10`}
                  />
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
                    <span className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-1">
                      {ad.tag}
                    </span>
                    <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                      {ad.title}
                    </h3>
                    <p className="text-emerald-100 text-sm mb-4">
                      {ad.subtitle}
                    </p>
                    <span className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                      {ad.cta || t('home.explore')}{" "}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
        </div>
      </section>

      {/* 7️⃣ NEW ARRIVALS */}
      <section className="py-10 md:py-14 border-y border-emerald-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-1.5 h-7 bg-emerald-400 rounded-full"></span>
              {t('home.newArrivals')}
            </h2>
            <a
              href="/new-arrivals"
              className="text-sm text-orange-500 font-bold hover:text-orange-600 transition"
            >
              {t('home.viewAll')}
            </a>
          </div>
          {loading ? (
            <SectionSkeleton />
          ) : newArrivals.length === 0 ? (
            <EmptySection />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8️⃣ BEST SELLING */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <span className="w-1.5 h-7 bg-orange-400 rounded-full"></span>
            {t('home.bestSelling')}
          </h2>
          <a
            href="/best-sellers"
            className="text-sm text-orange-500 font-bold hover:text-orange-600 transition"
          >
            {t('home.viewAll')}
          </a>
        </div>
        {loading ? (
          <SectionSkeleton />
        ) : bestSelling.length === 0 ? (
          <EmptySection />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {bestSelling.map((product) => (
              <ProductCard key={product.id} product={product} bestSeller />
            ))}
          </div>
        )}
      </section>

      {/* 9️⃣ TRUST BAR */}
      <section className="bg-emerald-900 text-emerald-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🚚", title: t('home.trust.freeDelivery'), desc: t('home.trust.freeDeliveryDesc') },
              { icon: "🔄", title: t('home.trust.easyReturns'), desc: t('home.trust.easyReturnsDesc') },
              { icon: "💯", title: t('home.trust.genuine'), desc: t('home.trust.genuineDesc') },
              { icon: "🛡️", title: t('home.trust.securePayment'), desc: t('home.trust.securePaymentDesc') },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-3xl mb-1">{item.icon}</span>
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-xs text-emerald-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
