"use client";

import React, { lazy, Suspense, ComponentType } from 'react';
import { ICON_CONFIG, IconName } from '@/data/sidebar/icons';

interface DynamicIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

// Cache for loaded icons
const iconCache = new Map<IconName, ComponentType<any>>();

// Error boundary component
const IconError = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <div 
    className={`bg-gray-200 rounded ${className}`}
    style={{ width: size, height: size }}
  />
);

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 20, className = '' }) => {
  const [IconComponent, setIconComponent] = React.useState<ComponentType<any> | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    setError(false);

    const loadIcon = async () => {
      // Check cache first
      if (iconCache.has(name)) {
        if (isMounted) {
          setIconComponent(iconCache.get(name)!);
        }
        return;
      }

      try {
        const iconImport = ICON_CONFIG[name];
        if (iconImport) {
          // IMPORTANT: lucide-react uses named exports
          const module = await iconImport();
          
          // Get the icon component from the module
          // The key is usually the icon name in PascalCase
          const iconName = Object.keys(module).find(key => 
            key.toLowerCase() === name.toLowerCase() ||
            key.toLowerCase().includes(name.toLowerCase())
          );
          
          if (iconName && module[iconName]) {
            const Component = module[iconName];
            
            if (isMounted) {
              iconCache.set(name, Component);
              setIconComponent(() => Component);
            }
          } else {
            // Fallback: try to get the first export
            const firstExport = Object.values(module)[0] as ComponentType<any>;
            if (firstExport && typeof firstExport === 'function') {
              if (isMounted) {
                iconCache.set(name, firstExport);
                setIconComponent(() => firstExport);
              }
            } else {
              throw new Error(`Could not find icon: ${name}`);
            }
          }
        } else {
          throw new Error(`Icon config not found: ${name}`);
        }
      } catch (error) {
        console.error(`Failed to load icon: ${name}`, error);
        if (isMounted) {
          setError(true);
        }
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [name]);

  // Show error state
  if (error) {
    return <IconError size={size} className={className} />;
  }

  // Show loading skeleton
  if (!IconComponent) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse rounded ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Render the icon
  return <IconComponent size={size} className={className} />;
};

export default React.memo(DynamicIcon);