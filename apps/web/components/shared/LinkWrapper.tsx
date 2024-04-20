import Link, { LinkProps } from 'next/link';
import React, { ReactNode } from 'react';

interface LinkWrapperProps extends LinkProps {
  disabled?: boolean;
  children?: ReactNode;
}

const LinkWrapper: React.FC<LinkWrapperProps> = ({ disabled, children, ...props }) => {
  if (disabled) return <>{children}</>;
  return <Link {...props}>{children}</Link>;
};

export default LinkWrapper;
