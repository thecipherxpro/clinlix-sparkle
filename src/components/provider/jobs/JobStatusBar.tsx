import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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
            {stages.map((stage, index) => {
              const isCompleted = index <= currentIndex;
              
              return (
                <CarouselItem key={stage.key} className="pl-2 basis-1/3">
                  <div className={`step ${isCompleted ? "step-primary" : ""} text-xs`}>
                    {stage.label}
                  </div>
                </CarouselItem>
              );
            })}
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
                className={`step text-sm ${isCompleted ? "step-primary" : ""}`}
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
