import { Navigation } from './Navigation'
import { ThemeToggle } from '../ui/ThemeToggle'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('border-b border-gray-200 dark:border-gray-800', className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              SynapticAI
            </Link>
            <Navigation />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
} 