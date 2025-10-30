export default function AnimatedSplashLogo() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated circular segments */}
        <g className="animate-spin origin-center" style={{ transformOrigin: '100px 100px', animationDuration: '3s' }}>
          {/* Top arc - light green */}
          <path
            d="M 100 30 A 70 70 0 0 1 155 60"
            fill="none"
            stroke="#A8D5A8"
            strokeWidth="12"
            strokeLinecap="round"
            className="animate-pulse"
          />
          
          {/* Right arc - green */}
          <path
            d="M 155 60 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#4A9B6F"
            strokeWidth="12"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          
          {/* Bottom right - teal */}
          <path
            d="M 170 100 A 70 70 0 0 1 140 155"
            fill="none"
            stroke="#5FB3B3"
            strokeWidth="12"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
          
          {/* Bottom left - blue */}
          <path
            d="M 140 155 A 70 70 0 0 1 60 155"
            fill="none"
            stroke="#4A7BA7"
            strokeWidth="12"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDelay: '0.6s' }}
          />
          
          {/* Left arc - dark blue */}
          <path
            d="M 60 155 A 70 70 0 0 1 30 100"
            fill="none"
            stroke="#2E4057"
            strokeWidth="12"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDelay: '0.8s' }}
          />
          
          {/* Top left - medium blue */}
          <path
            d="M 30 100 A 70 70 0 0 1 45 60"
            fill="none"
            stroke="#4A6B8A"
            strokeWidth="12"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </g>

        {/* Center pulsing circle */}
        <circle
          cx="100"
          cy="100"
          r="25"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          className="animate-ping"
          style={{ animationDuration: '2s' }}
        />
        
        {/* Static center dot */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="hsl(var(--primary))"
        />
      </svg>

      {/* Clinlix text below */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold tracking-tight animate-fade-in" style={{ fontFamily: 'Inter, sans-serif' }}>
          Clinlix
        </h1>
        <p className="text-muted-foreground text-sm mt-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Professional Cleaning Services
        </p>
      </div>
    </div>
  );
}
