import { cn } from '@/lib/utils';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function DashboardCard({ children, className, noPadding, ...props }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl glass-card',
        !noPadding && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
