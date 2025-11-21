import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string; // for accessibility
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, role }) => {
  return (
    <div 
      onClick={onClick}
      role={role}
      className={`
        relative overflow-hidden
        bg-zinc-900/60 backdrop-blur-md 
        border border-zinc-800/50 
        rounded-2xl 
        shadow-xl
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:border-gold-500/30 hover:shadow-gold-500/10 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};