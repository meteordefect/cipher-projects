// src/components/ui/Arrow.tsx
interface ArrowProps {
    className?: string;
  }
  
  export const Arrow = ({ className = "" }: ArrowProps) => (
    <svg 
      width=".5em" 
      height=".5em" 
      viewBox="0 0 18 18" 
      fill="none" 
      className={className}
    >
      <path 
        d="M2.1573 18L15.1348 5.02247V17.5955L18 14.6966V0H3.33708L0.438203 2.89888H12.9775L0 15.8764L2.1573 18Z" 
        fill="currentcolor" 
      />
    </svg>
  );