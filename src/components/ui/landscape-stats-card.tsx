import React from 'react';
import { Briefcase, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandscapeStatsCardProps {
  pendingJobs: number;
  activeToday: number;
  monthlyEarnings: number;
  className?: string;
}

export const LandscapeStatsCard: React.FC<LandscapeStatsCardProps> = ({
  pendingJobs,
  activeToday,
  monthlyEarnings,
  className,
}) => {
  return (
    <article 
      className={cn(
        "flex flex-col items-center relative w-full max-w-[220px] h-[350px] rounded-[20px] overflow-hidden bg-card",
        "shadow-[12px_12px_0px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      {/* Landscape Section */}
      <section className="relative w-full h-[70%] overflow-hidden">
        {/* Sky */}
        <div 
          className="absolute w-full h-full"
          style={{
            background: 'linear-gradient(0deg, rgb(247, 225, 87) 0%, rgb(233, 101, 148) 100%)'
          }}
        />
        
        {/* Sun */}
        <div 
          className="absolute flex items-center justify-center w-[45px] h-[45px] rounded-full bg-white bottom-[40%] left-[23%]"
          style={{ filter: 'drop-shadow(0px 0px 10px white)' }}
        >
          <div 
            className="absolute w-[118%] h-[118%] rounded-full bg-white opacity-50"
          />
          <div 
            className="absolute w-[134%] h-[134%] rounded-full bg-white opacity-10"
          />
        </div>
        
        {/* Ocean */}
        <div 
          className="absolute bottom-0 w-full h-[28%] overflow-hidden"
          style={{
            background: 'linear-gradient(0deg, rgb(241, 192, 125) 0%, rgb(247, 218, 150) 100%)'
          }}
        >
          {/* Reflections */}
          <div 
            className="absolute bg-white opacity-50 w-[40px] h-[10px] top-[5%] left-[32%] z-[1]"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 20%)' }}
          />
          <div 
            className="absolute bg-white opacity-50 w-[80px] h-[15px] top-[15%] left-[39%] z-[1]"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 60% 20%, 40% 20%)' }}
          />
          <div 
            className="absolute bg-white opacity-50 w-[60px] h-[2px] top-[27%] right-[15%] z-[1]"
            style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }}
          />
          <div 
            className="absolute bg-white opacity-50 w-[70px] h-[2px] top-[37%] right-[28%] z-[1]"
            style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }}
          />
          <div 
            className="absolute bg-white opacity-50 w-[70px] h-[3px] top-[46%] right-[8%] z-[1]"
            style={{ clipPath: 'polygon(0% 50%, 40% 0%, 60% 0%, 100% 50%, 60% 100%, 40% 100%)' }}
          />
          
          {/* Shadow Hills */}
          <div className="absolute right-[-25%] top-[-30%] w-[150px] h-[40px] rounded-full bg-[#f1c7a0] opacity-100" />
          <div className="absolute right-[-36%] top-[-65%] w-[150px] h-[80px] rounded-full bg-[#e5bb96] opacity-100" />
        </div>
        
        {/* Hill 1 */}
        <div className="absolute right-[-25%] bottom-[20%] w-[150px] h-[40px] rounded-full bg-[#e6b29d]" />
        
        {/* Hill 2 */}
        <div className="absolute right-[-36%] bottom-[10%] w-[150px] h-[80px] rounded-full bg-[#c29182]" />
        
        {/* Hill 3 */}
        <div className="absolute left-[-100%] bottom-[-28%] w-[350px] h-[150px] rounded-full bg-[#b77873] z-[3]" />
        
        {/* Tree 1 */}
        <div className="absolute bottom-[20%] left-[3%] w-[50px] h-[70px] z-[3]">
          <svg strokeWidth="0.00064" stroke="#b77873" fill="#b77873" xmlSpace="preserve" viewBox="0 0 64.00 64.00" xmlns="http://www.w3.org/2000/svg">
            <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
          </svg>
        </div>
        
        {/* Tree 2 */}
        <div className="absolute bottom-[14%] left-[25%] w-[50px] h-[70px] z-[3]">
          <svg strokeWidth="0.00064" stroke="#b77873" fill="#b77873" xmlSpace="preserve" viewBox="0 0 64.00 64.00" xmlns="http://www.w3.org/2000/svg">
            <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
          </svg>
        </div>
        
        {/* Hill 4 */}
        <div className="absolute right-[-100%] bottom-[-40%] w-[350px] h-[150px] rounded-full bg-[#a16773] z-[3]" />
        
        {/* Tree 3 */}
        <div className="absolute bottom-[10%] right-[1%] w-[65px] h-[80px] z-[3]">
          <svg strokeWidth="0.00064" stroke="#a16773" fill="#a16773" xmlSpace="preserve" viewBox="0 0 64.00 64.00" xmlns="http://www.w3.org/2000/svg">
            <path d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z" />
          </svg>
        </div>
        
        {/* Filter */}
        <div 
          className="absolute h-full w-full z-[5] opacity-20"
          style={{
            background: 'linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 40%)'
          }}
        />
      </section>
      
      {/* Stats Section */}
      <section className="w-full h-[30%] flex flex-col items-center">
        {/* Stats Info - Positioned over landscape */}
        <div className="flex items-center justify-around absolute top-0 right-0 w-full pt-[15px] text-white z-10 text-center">
          <div className="flex flex-col items-center w-[30%] text-[11pt] font-semibold">
            <div className="flex items-center justify-center">
              <Briefcase className="w-[35px] h-[35px]" />
            </div>
            <p className="text-xs mt-1">Pending</p>
            <p className="text-lg font-bold">{pendingJobs}</p>
          </div>
          
          <div className="flex flex-col items-end text-right pr-4">
            <div className="flex items-center justify-end w-full gap-1 mb-1">
              <Clock className="w-[14px] h-[14px]" />
              <span className="text-[11pt] font-bold uppercase">Active</span>
            </div>
            <p className="text-[9pt] m-0 p-0">Today</p>
            <p className="text-[20pt] font-bold leading-[30px]">{activeToday}</p>
          </div>
        </div>
        
        {/* Earnings Card */}
        <div className="flex items-center justify-center h-full w-full px-[15px] py-[12px]">
          <div className="w-full rounded-[20px] bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-[16px] backdrop-blur-sm border border-primary/20 shadow-lg">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8pt] font-medium text-muted-foreground uppercase tracking-wider">Monthly</span>
                  <span className="text-[18pt] font-bold text-foreground leading-none">€{monthlyEarnings.toFixed(0)}</span>
                </div>
                <DollarSign className="w-[30px] h-[30px] text-primary/60" />
              </div>
              
              <div className="grid grid-cols-2 gap-[8px] mt-[4px]">
                <div className="bg-card/80 rounded-[12px] p-[8px] border border-border/50">
                  <p className="text-[7pt] text-muted-foreground uppercase tracking-wide">Week</p>
                  <p className="text-[12pt] font-semibold text-foreground">€{(monthlyEarnings / 4).toFixed(0)}</p>
                </div>
                
                <div className="bg-card/80 rounded-[12px] p-[8px] border border-border/50">
                  <p className="text-[7pt] text-muted-foreground uppercase tracking-wide">Day</p>
                  <p className="text-[12pt] font-semibold text-foreground">€{(monthlyEarnings / 30).toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
