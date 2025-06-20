
import React from 'react';
import { Button } from '@/components/ui/button';
import { Power, PowerOff } from 'lucide-react';

interface VisibilityToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const VisibilityToggleButton = ({ 
  isVisible, 
  onToggle, 
  disabled = false,
  size = 'sm' 
}: VisibilityToggleButtonProps) => {
  return (
    <Button
      variant={isVisible ? "default" : "outline"}
      size={size}
      onClick={onToggle}
      disabled={disabled}
      className={`flex items-center gap-2 transition-all duration-200 ${
        isVisible 
          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300'
      }`}
    >
      {isVisible ? (
        <>
          <Power className="h-3 w-3" />
          <span className="text-xs font-medium">Visible</span>
        </>
      ) : (
        <>
          <PowerOff className="h-3 w-3" />
          <span className="text-xs font-medium">Masqué</span>
        </>
      )}
    </Button>
  );
};

export default VisibilityToggleButton;
