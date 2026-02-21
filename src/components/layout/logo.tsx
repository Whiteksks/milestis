// SVG Imports
import LogoSvg from '@/components/icons/logo'

// Util Imports
import { cn } from '@/lib/utils'

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoSvg className='w-24 h-auto sm:w-28 sm:h-auto lg:w-32 lg:h-auto' />
    </div>
  )
}

export default Logo
