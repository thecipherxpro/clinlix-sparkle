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
  return (
    <button 
      onClick={() => setSelected(text)} 
      className={`${
        selected 
          ? 'text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground'
      } relative rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 flex items-center gap-2 min-h-[44px] overflow-hidden group`}
    >
      {icon && (
        <span className={`relative z-10 transition-transform duration-300 ${selected ? 'scale-110' : 'group-hover:scale-105'}`}>
          {icon}
        </span>
      )}
      <span className="relative z-10 whitespace-nowrap">{text}</span>
      
      {selected && (
        <motion.div
          layoutId="tab"
          transition={{ 
            type: 'spring', 
            stiffness: 350, 
            damping: 30 
          }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/90 rounded-lg shadow-lg"
        />
      )}
      
      {!selected && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 z-0 bg-accent/10 rounded-lg"
        />
      )}
    </button>
  );
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
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {tabs.map(tab => (
        <Tab 
          key={tab.key} 
          text={tab.label} 
          icon={tab.icon} 
          selected={selected === tab.key} 
          setSelected={() => onTabChange(tab.key)} 
        />
      ))}
    </div>
  );
};