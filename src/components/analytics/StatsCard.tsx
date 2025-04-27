
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down";
  trendValue?: string;
}

export function StatsCard({ title, value, icon, className, trend, trendValue }: StatsCardProps) {
  return (
    <Card className={cn(
      "border-border bg-card transition-all hover:scale-105 rounded-2xl shadow-lg", 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {trend && trendValue && (
          <p className={cn("mt-1 text-xs", 
            trend === "up" ? "text-green-500" : "text-red-500"
          )}>
            {trend === "up" ? "↑" : "↓"} {trendValue} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
