import React from 'react';

interface QuickAccessItemProps {
  title: string;
  imageLink: string;
  isLarge?: boolean;
  titleInsideCard?: boolean;
  onClick?: () => void;
}

export const QuickAccessItem: React.FC<QuickAccessItemProps> = ({ 
  title, 
  imageLink, 
  isLarge = false, 
  titleInsideCard = false,
  onClick 
}) => {
  const itemWrapperClasses = isLarge ? "col-span-2" : "col-span-1";
  
  const cardBaseClasses = "bg-gray-100 rounded-2xl w-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer";
  
  let cardContentClasses;
  let imageClasses;

  if (titleInsideCard && isLarge) {
    // For large cards with title inside
    cardContentClasses = "flex flex-col justify-between items-start h-36 p-4";
    imageClasses = "h-full max-h-[80px] w-auto object-contain self-end";
  } else {
    // For cards with title underneath
    cardContentClasses = isLarge
      ? "flex justify-end items-center h-36 p-6"
      : "flex justify-center items-center h-32 p-4";
    imageClasses = isLarge
      ? "h-full max-h-[100px] w-auto object-contain"
      : "h-full max-h-[80px] w-auto object-contain";
  }

  return (
    <div className={`flex flex-col items-center ${itemWrapperClasses}`}>
      {/* The Card (gray box) */}
      <div 
        className={`${cardBaseClasses} ${cardContentClasses}`}
        onClick={onClick}
      >
        {titleInsideCard && isLarge && (
          <span className="text-xl font-semibold text-black self-start">
            {title}
          </span>
        )}
        <img
          src={imageLink}
          alt={title}
          className={imageClasses}
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = `https://placehold.co/120x120/f1f5f9/cbd5e1?text=img`;
          }}
        />
      </div>

      {/* Title Text (Under the card - only if not inside) */}
      {!titleInsideCard && (
        <span className="text-base font-semibold text-black mt-2">
          {title}
        </span>
      )}
    </div>
  );
};
