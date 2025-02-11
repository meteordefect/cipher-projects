'use client'

import { useBackground } from '@/context/BackgroundContext'
import styles from '@/app/initial-bg.module.css'

export default function BodyWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  const { isInitialLoading } = useBackground()

  return (
    <body className={`${className} ${isInitialLoading ? styles.initialBg : ''}`}>
      {children}
    </body>
  )
}
