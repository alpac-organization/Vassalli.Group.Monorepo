export type MetricCardProps = {
  title: string;
  value: string;
  trend?: string;
  icon?: React.ReactNode;
  themeClass?: string;
  size?: "default" | "compact";
  className?: string;
};

