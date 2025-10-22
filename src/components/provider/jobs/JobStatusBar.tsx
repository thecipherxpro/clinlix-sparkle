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
      <div className="overflow-x-auto scrollbar-hide md:overflow-visible">
        <ul className="steps steps-horizontal min-w-max md:min-w-0 md:w-full md:steps-vertical">
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
