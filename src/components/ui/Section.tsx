import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  hasBorder?: boolean;
}

export default function Section({
  children,
  className = '',
  id,
  hasBorder = false
}: SectionProps) {
  return (
    <section
      id={id}
      className={`
        section-padding
        ${hasBorder ? 'section-border' : ''}
        ${className}
      `}
    >
      {children}
    </section>
  )
}