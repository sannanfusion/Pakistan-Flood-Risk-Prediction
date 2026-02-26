interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
}

export function SectionHeader({ icon, title, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {badge}
    </div>
  );
}
