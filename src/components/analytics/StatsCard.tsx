
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
  return <Card className={cn("modern-glass-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-0 mb-2">
        <CardTitle className="font-warp text-sm font-normal text-gray-300">
          {title}
        </CardTitle>
        {icon && <div className="text-purple-500">{icon}</div>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && trendValue && <p className={cn("mt-1 text-xs", trend === "up" ? "text-green-400" : "text-red-400")}>
            {trend === "up" ? "↑" : "↓"} {trendValue} from last month
          </p>}
      </CardContent>
    </Card>;
}
