import React from "react";

// ---  START: CUSTOMIZABLE CONFIGURATION  --- //

// Edit this object to customize all content in the grid.
const dashboardConfig = {
  quickAccess: {
    // This config now only holds the data for the *visible* cards.
    // The layout (empty space next to "Ride") will be handled by explicit grid placement in `QuickAccessGrid`.
    items: [
      {
        title: "Ride",
        imageLink: "https://s6.imgcdn.dev/Yyfi5T.png",
        isLarge: true, // Style as large
        titleInsideCard: true,
        cardBgColor: "bg-gray-100", // Default color
      },
      {
        title: "Reserve",
        imageLink: "https://i.imgur.com/z1hX9tH.png",
        cardBgColor: "bg-blue-100", // Example of a custom color
      },
      {
        title: "Hourly",
        imageLink: "https://i.imgur.com/vH1y2gZ.png",
        cardBgColor: "bg-gray-100",
      },
      {
        title: "Transit",
        imageLink: "https://i.imgur.com/k9bT69k.png",
        cardBgColor: "bg-gray-100",
      },
      {
        title: "Charter",
        imageLink: "https://i.imgur.com/L12nO9Z.png",
        cardBgColor: "bg-gray-100",
      },
    ],
  },
};

// ---  END: CUSTOMIZABLE CONFIGURATION  --- //

/**
 * Component 1: QuickAccessItem
 * Renders a single item in the quick access grid.
 */
function QuickAccessItem({
  title,
  imageLink,
  isLarge = false,
  titleInsideCard = false,
  colSpan = 1,
  cardBgColor = "bg-gray-100",
}) {
  const itemWrapperClasses = `col-span-${colSpan}`;

  // Base card styling now uses the cardBgColor prop
  let cardBaseClasses = `${cardBgColor} rounded-2xl w-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer`;
  let cardContentClasses;
  let imageClasses;

  if (titleInsideCard && isLarge) {
    // For large cards with title inside (like "Ride")
    cardContentClasses = "flex flex-col justify-between items-start h-36 p-4";
    imageClasses = "h-full max-h-[150px] w-[110px] object-contain self-end";
  } else {
    // For other cards (small cards with title underneath)
    cardContentClasses = "flex justify-center items-center h-32 p-4";
    imageClasses = "h-full max-h-[80px] w-auto object-contain";
  }

  return (
    <div className={`flex flex-col items-center ${itemWrapperClasses}`}>
      {/* The Card (styles updated) */}
      <div className={`${cardBaseClasses} ${cardContentClasses}`}>
        {titleInsideCard && isLarge && <span className="text-xl font-semibold text-black self-start">{title}</span>}
        <img
          src={imageLink}
          alt={title}
          className={imageClasses}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/120x120/f1f5f9/cbd5e1?text=img`;
          }}
        />
      </div>

      {/* Title Text (Under the card - only if not inside) */}
      {!titleInsideCard && <span className="text-base font-semibold text-black mt-2">{title}</span>}
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
    <div className="w-full max-w-md space-y-6">
      {/* First Card: "Ride" - Full Width */}
      <QuickAccessItem
        title={items[0].title}
        imageLink={items[0].imageLink}
        isLarge={items[0].isLarge}
        titleInsideCard={items[0].titleInsideCard}
        colSpan={1}
        cardBgColor={items[0].cardBgColor} // Pass color prop
      />

      {/* 2-Column Grid for Remaining Cards */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {/* Items 2 & 3: "Reserve" & "Hourly" */}
        <QuickAccessItem
          title={items[1].title}
          imageLink={items[1].imageLink}
          colSpan={1}
          cardBgColor={items[1].cardBgColor} // Pass color prop
        />
        <QuickAccessItem
          title={items[2].title}
          imageLink={items[2].imageLink}
          colSpan={1}
          cardBgColor={items[2].cardBgColor} // Pass color prop
        />

        {/* Items 4 & 5: "Transit" & "Charter" */}
        <QuickAccessItem
          title={items[3].title}
          imageLink={items[3].imageLink}
          colSpan={1}
          cardBgColor={items[3].cardBgColor} // Pass color prop
        />
        <QuickAccessItem
          title={items[4].title}
          imageLink={items[4].imageLink}
          colSpan={1}
          cardBgColor={items[4].cardBgColor} // Pass color prop
        />
      </div>
    </div>
  );
}
