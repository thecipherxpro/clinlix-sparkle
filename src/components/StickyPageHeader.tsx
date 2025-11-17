import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const StickyPageHeader = ({
  title,
  subtitle,
  onBack,
  className,
  children,
}: StickyPageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm",
        "safe-area-inset-top",
        className
      )}
    >
      <div className="flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-4 min-h-[60px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full h-11 w-11 shrink-0 hover:bg-primary/10 active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </header>
  );
};
