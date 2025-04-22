import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Conversations', href: '/conversations' },
  { name: 'Settings', href: '/settings' },
]

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center space-x-4', className)}>
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
            pathname === item.href
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
} 