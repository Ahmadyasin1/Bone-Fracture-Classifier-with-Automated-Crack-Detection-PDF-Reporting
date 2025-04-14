import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ children, href, className, ...props }) => {
  return (
    <a
      href={href}
      className={`transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};