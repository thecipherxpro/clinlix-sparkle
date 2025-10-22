import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface JobStatusBarProps {
  currentStatus: string;
}

const JobStatusBar = ({ currentStatus }: JobStatusBarProps) => {
  const stages = [
    { key: "confirmed", label: "Confirmed" },
    { key: "on_the_way", label: "On the way" },
    { key: "arrived", label: "Arrived" },
    { key: "started", label: "Started" },
    { key: "completed", label: "Completed" },
  ];

  const currentIndex = stages.findIndex((s) => s.key === currentStatus);

  return (
    <div className="py-4 w-full">
      <div className="md:hidden">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            <CarouselItem className="pl-2 basis-full">
              <ul className="steps steps-horizontal w-full min-w-max">
                {stages.map((stage, index) => {
                  const isCompleted = index <= currentIndex;
                  
                  return (
                    <li 
                      key={stage.key} 
                      className={`step text-xs sm:text-sm ${isCompleted ? "step-primary" : ""}`}
                    >
                      {stage.label}
                    </li>
                  );
                })}
              </ul>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      <div className="hidden md:block">
        <ul className="steps steps-vertical w-full">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            
            return (
              <li 
                key={stage.key} 
                className={`step text-xs sm:text-sm ${isCompleted ? "step-primary" : ""}`}
              >
                {stage.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default JobStatusBar;
