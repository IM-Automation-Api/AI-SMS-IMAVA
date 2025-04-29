
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

export function StatsCard({
  title,
  value,
  icon,
  className,
  trend,
  trendValue
}: StatsCardProps) {
  return (
    <Card className={cn(
      "neo-blur border-white/5 transition-all duration-300 rounded-xl shadow-glow", 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gradient-primary">{value}</div>
        {trend && trendValue && (
          <p className={cn(
            "mt-1 text-xs", 
            trend === "up" ? "text-green-400" : "text-red-400"
          )}>
            {trend === "up" ? "↑" : "↓"} {trendValue} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
