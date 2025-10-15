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
  return /* Mobile-first auto-fit card with responsive border radius and padding */<div className="relative bg-[#EAF7F7] rounded-[clamp(20px,5vw,24px)] border border-gray-200 
                    shadow-sm overflow-hidden w-full">
      {bgPatternUrl && <img src={bgPatternUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt="" />}

      
    </div>;
};
export default ActionCard;