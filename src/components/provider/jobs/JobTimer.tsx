import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JobTimerProps {
  startedAt: string;
  timeIncluded: string;
  bookingId: string;
  overtimeMinutes: number;
}

const JobTimer = ({ startedAt, timeIncluded, overtimeMinutes }: JobTimerProps) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);

  // Parse time included (e.g., "2h30" -> 150 minutes)
  const parseTimeIncluded = (time: string): number => {
    const match = time.match(/(\d+)h(\d*)/);
    if (!match) return 120; // Default 2 hours
    const hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  };

  const totalMinutesIncluded = parseTimeIncluded(timeIncluded);
  const totalSecondsIncluded = totalMinutesIncluded * 60;

  useEffect(() => {
    const interval = setInterval(() => {
      const startTime = new Date(startedAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);

      // Check if overtime
      if (elapsed > totalSecondsIncluded) {
        setIsOvertime(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, totalSecondsIncluded]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getRemainingTime = (): number => {
    return Math.max(0, totalSecondsIncluded - elapsedSeconds);
  };

  const getOvertimeMinutes = (): number => {
    if (!isOvertime) return 0;
    return Math.floor((elapsedSeconds - totalSecondsIncluded) / 60);
  };

  const overtimeFee = Math.ceil(getOvertimeMinutes() / 30) * 10;

  return (
    <Card className={isOvertime ? "border-orange-500 border-2" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Job Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isOvertime ? (
          <>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Time Remaining</p>
              <p className="text-4xl font-bold font-mono text-primary">
                {formatTime(getRemainingTime())}
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Started: {new Date(startedAt).toLocaleTimeString()}</p>
            </div>
          </>
        ) : (
          <>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Job time exceeded! Overtime charges apply: €10 per 30 minutes.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Overtime</p>
              <p className="text-4xl font-bold font-mono text-orange-600">
                +{getOvertimeMinutes()} min
              </p>
              <p className="text-lg font-semibold text-orange-600 mt-2">
                +€{overtimeFee} overtime fee
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Total elapsed: {formatTime(elapsedSeconds)}</p>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Included time:</span>
            <span className="font-medium">{timeIncluded}</span>
          </div>
          {overtimeMinutes > 0 && (
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">Previous overtime:</span>
              <span className="font-medium text-orange-600">+{overtimeMinutes} min</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobTimer;
