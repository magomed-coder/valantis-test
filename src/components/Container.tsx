import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  const containerClasses = `container mx-auto px-2 md:px-6 ${className}`;

  return <div className={containerClasses}>{children}</div>;
};

export default Container;
