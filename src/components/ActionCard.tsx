import React from "react";
import { motion } from "framer-motion";

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
  </svg>
);

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
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative bg-accent/30 rounded-2xl sm:rounded-3xl border border-border 
                 shadow-sm hover:shadow-md overflow-hidden w-full min-h-[120px] sm:min-h-[140px] 
                 transition-shadow duration-200 cursor-pointer touch-target"
      onClick={onSwipeClick}
    >
      {bgPatternUrl && (
        <img 
          src={bgPatternUrl} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" 
          alt="" 
        />
      )}
      
      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between h-full">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden bg-background/50">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2">
            {title}
          </h3>
        </div>
        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground flex-shrink-0" />
      </div>
    </motion.div>
  );
};

export default ActionCard;