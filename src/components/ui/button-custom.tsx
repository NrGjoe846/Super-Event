
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonCustomProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  withRipple?: boolean;
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonCustomProps>(
  ({ 
    className, 
    children, 
    variant = "primary", 
    size = "md", 
    isLoading, 
    icon, 
    iconPosition = "left",
    withRipple = true,
    ...props 
  }, ref) => {
    const variants = {
      primary: "bg-brand-blue text-white hover:bg-brand-blue/90 shadow-sm hover:shadow-md",
      secondary: "bg-gray-100 text-brand-blue hover:bg-gray-200 shadow-sm hover:shadow-md",
      outline: "bg-transparent border border-brand-blue text-brand-blue hover:bg-brand-blue/5",
      ghost: "bg-transparent text-brand-blue hover:bg-gray-100",
      gold: "bg-brand-gold text-brand-blue hover:bg-brand-gold/90 shadow-sm hover:shadow-md",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded-md",
      md: "text-sm px-4 py-2 rounded-md",
      lg: "text-base px-6 py-3 rounded-md",
    };

    const [ripples, setRipples] = React.useState<{id: number, x: number, y: number, size: number}[]>([]);
    const rippleCount = React.useRef(0);

    const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!withRipple) return;
      
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Calculate ripple size (larger of width or height, times 2.5 for full coverage)
      const size = Math.max(button.offsetWidth, button.offsetHeight) * 2.5;
      
      const id = rippleCount.current;
      rippleCount.current += 1;
      
      setRipples(prev => [...prev, { id, x, y, size }]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id));
      }, 600);
    };

    return (
      <button
        className={cn(
          "relative font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        onClick={(e) => {
          handleRipple(e);
          props.onClick?.(e);
        }}
        {...props}
      >
        {ripples.map(ripple => (
          <span 
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ripple"
            style={{
              top: ripple.y - ripple.size / 2,
              left: ripple.x - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}
        
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : icon && iconPosition === "left" ? (
          <span className="transition-transform group-hover:translate-x-0.5">{icon}</span>
        ) : null}
        
        <span className="relative z-10">{children}</span>
        
        {!isLoading && icon && iconPosition === "right" ? (
          <span className="transition-transform group-hover:translate-x-0.5">{icon}</span>
        ) : null}
      </button>
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom };
