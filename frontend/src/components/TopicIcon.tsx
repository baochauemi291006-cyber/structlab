import { Brackets, Layers3, ListStart, Network, type LucideProps } from "lucide-react";

const icons = {
  Brackets,
  Layers: Layers3,
  ListStart,
  Network,
};

export function TopicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? Network;
  return <Icon {...props} />;
}
