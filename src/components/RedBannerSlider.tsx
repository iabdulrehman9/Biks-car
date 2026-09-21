import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useTranslation } from '@/lib/i18n';
import headlineImg from '@/img/Headline.png';

export function RedBannerSlider() {
  const { navigate } = useRouter();
  const { language } = useTranslation();

  const welcomeText = language === 'ja'
    ? 'BIKS TRADING COMPANY へようこそ'
    : 'WELCOME TO BIKS TRADING COMPANY';

  const ctaText = language === 'ja'
    ? 'コレクションを見る'
    : 'Explore More Collection';

  // We repeat the train car item multiple times to create a seamless infinite moving train
  const items = [1, 2, 3, 4];

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/collection');
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0A101D] select-none border-b border-black/40">
      <style>{`
        @keyframes bannerTrainLtr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-banner-train {
          display: flex;
          width: max-content;
          animation: bannerTrainLtr 24s linear infinite;
        }
        .banner-train-wrapper:hover .animate-banner-train {
          animation-play-state: paused;
        }
      `}</style>

      {/* 3D Metallic Crimson Banner Bar (Reduced Sleek Height) */}
      <div className="banner-train-wrapper relative py-2 sm:py-2.5 bg-gradient-to-r from-[#5a040d] via-[#940d1a] to-[#5a040d] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.5),0_4px_16px_rgba(148,13,26,0.35)] border-y border-[#D0A030]/50 overflow-hidden">
        
        {/* Ambient Gloss Highlight */}
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.6)_40%,transparent_60%)] animate-[pulse_4s_ease-in-out_infinite]" />

        {/* Continuous Moving Train Track */}
        <div className="animate-banner-train flex items-center">
          {/* Two duplicated sets for infinite 50% loop */}
          {[...items, ...items].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 sm:gap-6 px-6 sm:px-10 shrink-0"
            >
              {/* Gold Sparkle Icon */}
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#D0A030] shrink-0 animate-pulse" />

              {/* WELCOME TO BIKS TRADING COMPANY (Increased Font Size, Single Row) */}
              <span className="font-heading text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">
                {welcomeText}
              </span>

              {/* Headline Machine Image */}
              <div className="flex items-center shrink-0">
                <img
                  src={headlineImg}
                  alt="BIKS Machinery"
                  className="h-9 sm:h-11 md:h-12 w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] filter contrast-105 hover:scale-105 transition-transform bg-transparent"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Explore More Collection Button */}
              <button
                type="button"
                onClick={handleCtaClick}
                className="group inline-flex items-center gap-1.5 rounded-full bg-[#D0A030] px-4 py-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#001030] shadow-[0_2px_8px_rgba(208,160,48,0.4)] transition-all hover:bg-[#e0b040] hover:shadow-[0_3px_12px_rgba(208,160,48,0.6)] active:scale-95 shrink-0"
              >
                <span>{ctaText}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Separator Divider */}
              <span className="text-[#D0A030]/60 text-lg font-black shrink-0 px-2">
                •
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
