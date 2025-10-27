import React from 'react';

// ---  START: CUSTOMIZABLE CONFIGURATION  --- //

// Edit this object to customize all content in the grid.
const dashboardConfig = {
    quickAccess: {
        // This config now only holds the data for the *visible* cards.
        // The layout (empty space next to "Ride") will be handled by explicit grid placement in `QuickAccessGrid`.
        items: [
            {
                title: "Ride",
                imageLink: "https://i.imgur.com/rGfF8yU.png",
                isLarge: true, // Style as large
                titleInsideCard: true
            },
            {
                title: "Reserve",
                imageLink: "https://i.imgur.com/z1hX9tH.png"
            },
            {
                title: "Hourly",
                imageLink: "https://i.imgur.com/vH1y2gZ.png"
            },
            {
                title: "Transit",
                imageLink: "https://i.imgur.com/k9bT69k.png"
            },
            {
                title: "Charter",
                imageLink: "https://i.imgur.com/L12nO9Z.png"
            }
        ]
    }
};

// ---  END: CUSTOMIZABLE CONFIGURATION  --- //

/**
 * Component 1: QuickAccessItem
 * Renders a single item in the quick access grid.
 */
function QuickAccessItem({ title, imageLink, isLarge = false, titleInsideCard = false, colSpan = 1 }) {
    
    const itemWrapperClasses = `col-span-${colSpan}`;
    
    // Base card styling
    let cardBaseClasses = "bg-gray-100 rounded-2xl w-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer";
    let cardContentClasses;
    let imageClasses;

    if (titleInsideCard && isLarge) {
        // For large cards with title inside (like "Ride")
        cardContentClasses = "flex flex-col justify-between items-start h-36 p-4";
        imageClasses = "h-full max-h-[80px] w-auto object-contain self-end";
    } else {
        // For other cards (small cards with title underneath)
        cardContentClasses = "flex justify-center items-center h-32 p-4";
        imageClasses = "h-full max-h-[80px] w-auto object-contain";
    }

    return (
        <div 
            className={`flex flex-col items-center ${itemWrapperClasses}`}
        >
            {/* The Card (gray box) */}
            <div 
                className={`${cardBaseClasses} ${cardContentClasses}`}
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
                        const img = e.target as HTMLImageElement;
                        img.onerror = null; 
                        img.src = `https://placehold.co/120x120/f1f5f9/cbd5e1?text=img`; 
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
}

/**
 * Component 2: The Main Grid Component
 * Renders all items based on the config and explicit layout.
 * This component is exported as the default.
 */
export default function QuickAccessGrid() {
    const { items } = dashboardConfig.quickAccess;

    return (
        <div className="w-full max-w-md">
            {/* Explicitly defining grid for this specific layout */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                
                {/* Item 1: "Ride" - full width, spans 2 columns */}
                <QuickAccessItem
                    title={items[0].title}
                    imageLink={items[0].imageLink}
                    isLarge={items[0].isLarge}
                    titleInsideCard={items[0].titleInsideCard}
                    colSpan={2} // Full width across both columns
                />
                
                {/* Items 2 & 3: "Reserve" & "Hourly" */}
                <QuickAccessItem
                    title={items[1].title}
                    imageLink={items[1].imageLink}
                    colSpan={1}
                />
                <QuickAccessItem
                    title={items[2].title}
                    imageLink={items[2].imageLink}
                    colSpan={1}
                />
                
                {/* Items 4 & 5: "Transit" & "Charter" */}
                <QuickAccessItem
                    title={items[3].title}
                    imageLink={items[3].imageLink}
                    colSpan={1}
                />
                <QuickAccessItem
                    title={items[4].title}
                    imageLink={items[4].imageLink}
                    colSpan={1}
                />
            </div>
        </div>
    );
}
