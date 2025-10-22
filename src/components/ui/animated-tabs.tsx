import { motion } from 'framer-motion';
import { ReactNode } from 'react';
interface TabProps {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  icon?: ReactNode;
}
const Tab = ({
  text,
  selected,
  setSelected,
  icon
}: TabProps) => {
  return <button onClick={() => setSelected(text)} className={`${selected ? 'text-white' : 'text-muted-foreground hover:text-foreground'} relative rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 min-h-[44px]`}>
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{text}</span>
      {selected && <motion.span layoutId="tab" transition={{
      type: 'spring',
      duration: 0.4
    }} className="absolute inset-0 z-0 rounded-md bg-primary"></motion.span>}
    </button>;
};
interface AnimatedTabsProps {
  tabs: {
    key: string;
    label: string;
    icon?: ReactNode;
  }[];
  selected: string;
  onTabChange: (key: string) => void;
  className?: string;
}
export const AnimatedTabs = ({
  tabs,
  selected,
  onTabChange,
  className = ''
}: AnimatedTabsProps) => {
  return <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {tabs.map(tab => <Tab key={tab.key} text={tab.label} icon={tab.icon} selected={selected === tab.key} setSelected={() => onTabChange(tab.key)} className="px-[53px] mx-[14px]" />)}
    </div>;
};