import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-100',
        hover && 'hover:shadow-md transition-shadow cursor-pointer',
        padding === 'none' ? '' : 'p-4 sm:p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
