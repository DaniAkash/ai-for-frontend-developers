import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sun, Moon, Thermometer, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RootObject {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Currentunits;
  current: Current;
  hourly_units: Hourlyunits;
  hourly: Hourly;
  daily_units: Dailyunits;
  daily: Daily;
}

interface Daily {
  time: string[];
  sunrise: string[];
  sunset: string[];
}

interface Dailyunits {
  time: string;
  sunrise: string;
  sunset: string;
}

interface Hourly {
  time: string[];
  temperature_2m: number[];
}

interface Hourlyunits {
  time: string;
  temperature_2m: string;
}

interface Current {
  time: string;
  interval: number;
  temperature_2m: number;
}

interface Currentunits {
  time: string;
  interval: string;
  temperature_2m: string;
}

interface WeatherWidgetProps {
  weatherData?: RootObject;
}

export default function WeatherWidget({ weatherData }: WeatherWidgetProps) {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (!weatherData) {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Weather data is not available. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { current, hourly, daily } = weatherData;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent className="w-full max-w-3xl">
        <div className="grid gap-4">
          {/* Current Temperature */}
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Temperature
              </CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {current.temperature_2m}°C
              </div>
              <p className="text-xs text-muted-foreground">
                As of {formatTime(current.time)}
              </p>
            </CardContent>
          </Card>

          {/* Hourly Forecast */}
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                24-Hour Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <div className="flex h-[64px] space-x-4">
                  {hourly.time.slice(0, 24).map((time, index) => (
                    <div key={time} className="flex flex-col items-center">
                      <span className="text-sm">{formatTime(time)}</span>
                      <span className="text-lg font-bold">
                        {hourly.temperature_2m[index]}°C
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Daily Sunrise/Sunset */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Sunrise & Sunset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {daily.time.slice(0, 5).map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span>{formatDate(day)}</span>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span>{formatTime(daily.sunrise[index]!)}</span>
                      <Moon className="h-4 w-4 text-blue-500" />
                      <span>{formatTime(daily.sunset[index]!)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
