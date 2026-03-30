export type StatsCardProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: "up" | "down";
  borderColor?: string;
};
