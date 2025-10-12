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
  return <div className="relative bg-[#EAF7F7] rounded-3xl border border-gray-200 shadow-sm overflow-hidden w-full">
      {bgPatternUrl && <img src={bgPatternUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt="" />}

      <div className="relative z-10 flex items-center justify-between p-5 sm:p-6">
        <div className="flex flex-col space-y-4">
          <h2 className="sm:text-3xl font-bold text-[#0D6A6A] text-lg">{title}</h2>
          <button onClick={onSwipeClick} className="flex items-center space-x-3 bg-[#0D6A6A] rounded-full py-2 pl-2 pr-5 self-start transition-transform hover:scale-105">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
              <ChevronRightIcon className="w-4 h-4 text-[#0D6A6A]" />
            </div>
            <span className="text-white font-semibold tracking-wider text-sm">SWIPE</span>
          </button>
        </div>

        <div className="flex-shrink-0">
          <img src="https://i.postimg.cc/YSMn7Lkk/77-JOBS.png" alt={title} className="w-auto h-auto sm:w-auto " />
        </div>
      </div>
    </div>;
};
export default ActionCard;