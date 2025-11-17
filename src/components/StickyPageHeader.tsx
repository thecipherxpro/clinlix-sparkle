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
    <div
      className={cn(
        "sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border",
        className
      )}
    >
      <div className="flex items-center gap-3 px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full h-10 w-10 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
