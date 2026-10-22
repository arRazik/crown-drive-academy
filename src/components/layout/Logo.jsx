import React from 'react';
import Icon from '../ui/Icon';

// شعار التطبيق: تاج ذهبي داخل مربع (اللون من theme.css)
function Logo({ size = 'md' }) {
  const box = size === 'lg' ? 'h-16 w-16 rounded-2xl' : 'h-11 w-11 rounded-xl';
  const icon = size === 'lg' ? 'h-9 w-9' : 'h-6 w-6';
  return (
    <span className={`flex ${box} shrink-0 items-center justify-center bg-accent text-side shadow-lg`}>
      <Icon name="crown" className={icon} />
    </span>
  );
}

export default Logo;
