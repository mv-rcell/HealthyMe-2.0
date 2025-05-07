import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  showTagline = false,
  size = "md" 
}) => {
  const sizeClasses = {
    sm: {
      container: "gap-1",
      icon: "w-5 h-5",
      text: "text-lg",
      tagline: "text-[8px]"
    },
    md: {
      container: "gap-2",
      icon: "w-8 h-8",
      text: "text-2xl",
      tagline: "text-xs"
    },
    lg: {
      container: "gap-3",
      icon: "w-12 h-12",
      text: "text-3xl",
      tagline: "text-sm"
    }
  };

  return (
    <Link
      to="/"
      className={cn(
        "font-bold flex flex-col items-center text-primary", 
        sizeClasses[size].container,
        className
      )}
    >
      <div className="flex flex-col items-center">
        <div className={cn("relative", sizeClasses[size].icon)}>
          <img 
            src="/IMG_0733(1).PNG" 
            alt="HealthyMe Logo" 
            className="w-full h-auto"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className={cn("font-bold", sizeClasses[size].text)}>
            HealthyMe
          </span>
          {showTagline && (
            <span className={cn("text-yellow-400 uppercase tracking-wider font-medium", sizeClasses[size].tagline)}>
              Your Health Our Priority
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Logo;