import { Suspense, ReactNode } from 'react'
import { ComponentLoading } from './LoadingStates'

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseWrapper({ children, fallback = <ComponentLoading /> }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}
