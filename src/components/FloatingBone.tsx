import React, { useEffect, useRef, useState } from 'react';

export const FloatingBone: React.FC = () => {
  const [isCracked, setIsCracked] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (!isCracked) {
      setIsCracked(true);
      timeoutRef.current = setTimeout(() => {
        setIsCracked(false);
      }, 3000);
    }
  };

  return (
    <div
      className={`absolute right-20 top-40 w-32 h-32 cursor-pointer transition-transform duration-[3000ms] 
        ${isCracked ? 'scale-110 opacity-0' : 'animate-float'}`}
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transform transition-all duration-300
          ${isCracked ? 'rotate-12 scale-110' : ''}`}
      >
        <path
          d="M8 5.5C8 3.567 9.567 2 11.5 2C13.433 2 15 3.567 15 5.5C15 7.433 13.433 9 11.5 9C9.567 9 8 7.433 8 5.5Z"
          className={`${
            isCracked
              ? 'stroke-red-500 fill-red-500/20'
              : 'stroke-amber-400/40 fill-amber-400/20'
          }`}
          strokeWidth="2"
        />
        <path
          d="M4.5 15C4.5 13.067 6.067 11.5 8 11.5C9.933 11.5 11.5 13.067 11.5 15C11.5 16.933 9.933 18.5 8 18.5C6.067 18.5 4.5 16.933 4.5 15Z"
          className={`${
            isCracked
              ? 'stroke-red-500 fill-red-500/20'
              : 'stroke-amber-400/40 fill-amber-400/20'
          }`}
          strokeWidth="2"
        />
        <path
          d="M11.5 15C11.5 13.067 13.067 11.5 15 11.5C16.933 11.5 18.5 13.067 18.5 15C18.5 16.933 16.933 18.5 15 18.5C13.067 18.5 11.5 16.933 11.5 15Z"
          className={`${
            isCracked
              ? 'stroke-red-500 fill-red-500/20'
              : 'stroke-amber-400/40 fill-amber-400/20'
          }`}
          strokeWidth="2"
        />
        {isCracked && (
          <>
            <path
              d="M2 2L22 22"
              stroke="red"
              strokeWidth="2"
              className="animate-crack"
            />
            <path
              d="M22 2L2 22"
              stroke="red"
              strokeWidth="2"
              className="animate-crack"
            />
          </>
        )}
      </svg>
    </div>
  );
};