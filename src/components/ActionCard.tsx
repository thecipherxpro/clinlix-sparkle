import React from "react";
const ChevronRightIcon = ({
  className
}: {
  className?: string;
}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
  </svg>;
interface ActionCardProps {
  title: string;
  imageUrl: string;
  bgPatternUrl?: string;
  onSwipeClick?: () => void;
}
const ActionCard = ({
  title,
  imageUrl,
  bgPatternUrl,
  onSwipeClick = () => alert("Swipe button clicked!")
}: ActionCardProps) => {
  return (
    /* Mobile-first auto-fit card with responsive border radius and padding */
    <div className="relative bg-[#EAF7F7] rounded-[clamp(20px,5vw,24px)] border border-gray-200 
                    shadow-sm overflow-hidden w-full">
      {bgPatternUrl && (
        <img 
          src={bgPatternUrl} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" 
          alt="" 
        />
      )}

      <div className="relative z-10 flex items-center justify-between 
                      p-[clamp(16px,4vw,24px)] gap-[clamp(12px,3vw,20px)]">
        <div className="flex flex-col space-y-[clamp(12px,3vw,16px)]">
          <h2 className="text-[clamp(18px,4.5vw,28px)] font-bold text-[#0D6A6A]">
            {title}
          </h2>
          <button 
            onClick={onSwipeClick} 
            className="flex items-center space-x-[clamp(8px,2vw,12px)] bg-[#0D6A6A] 
                     rounded-full py-[clamp(8px,2vw,10px)] pl-[clamp(8px,2vw,10px)] 
                     pr-[clamp(16px,4vw,20px)] self-start transition-transform 
                     hover:scale-105 active:scale-95"
          >
            <div className="w-[clamp(32px,8vw,40px)] h-[clamp(32px,8vw,40px)] 
                          rounded-full bg-white flex items-center justify-center shadow">
              <ChevronRightIcon className="w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)] text-[#0D6A6A]" />
            </div>
            <span className="text-white font-semibold tracking-wider 
                           text-[clamp(12px,3vw,14px)]">
              SWIPE
            </span>
          </button>
        </div>

        <div className="flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-[clamp(80px,20vw,128px)] h-auto object-contain" 
          />
        </div>
      </div>
    </div>
  );
};
export default ActionCard;