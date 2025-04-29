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
  return <Card className={cn("border-border bg-gradient-to-br from-[#1B1B33] to-[#0F0F0F] transition-all duration-300 hover:scale-105 rounded-2xl shadow-lg shadow-purple-900/20", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-indigo-400 bg-transparent">{value}</div>
        {trend && trendValue && <p className={cn("mt-1 text-xs", trend === "up" ? "text-green-400" : "text-red-400")}>
            {trend === "up" ? "↑" : "↓"} {trendValue} from last month
          </p>}
      </CardContent>
    </Card>;
}