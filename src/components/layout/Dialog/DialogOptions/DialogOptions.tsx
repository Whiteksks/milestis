import { UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type DialogSignInOptionsProps = {
  onSignInClick?: () => void
  onSignUpClick?: () => void
  onMagicLinkClick?: () => void
}

const DialogSignInOptions = ({ onSignInClick, onSignUpClick, onMagicLinkClick }: DialogSignInOptionsProps) => {
  return (
    <>
      {/* Иконка сверху */}
      <div className="items-center flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UserIcon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xl font-semibold">Authentication Options</span>
      </div>

      {/* Подзаголовок */}
      <p className="text-center text-muted-foreground text-base mb-4">
        Select a method to access your account or create a new one.
      </p>

      {/* Основные кнопки */}
      <div className="flex flex-col gap-4 mt-4">
        <Button
          onClick={() => {
            console.log('Sign in button clicked')
            onSignInClick?.()
          }}
          className="w-full bg-primary text-primary-foreground 
                     hover:bg-primary/90 focus-visible:ring-primary 
                     transition-colors duration-200 cursor-pointer"
        >
          Sign in with Email & Password
        </Button>

        <Button
          variant="secondary"
          className="w-full cursor-pointer 
                     hover:bg-secondary/80 transition-colors duration-200"
          onClick={() => {
            console.log('Magic link button clicked')
            onMagicLinkClick?.()
          }}
        >
          Sign in via Magic Link (Email)
        </Button>
      </div>

      {/* Разделитель */}
      <div className="before:bg-border after:bg-border flex items-center gap-4 before:h-px before:flex-1 after:h-px after:flex-1 mt-6 mb-2">
        <span className="text-muted-foreground text-xs">Or sign in with</span>
      </div>

      {/* Соц. логин */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2 
                     cursor-pointer hover:bg-accent/10 
                     transition-colors duration-200"
        >
          <img
            src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-icon.png?width=20&height=20&format=auto"
            alt="Google Icon"
            className="h-5 w-5"
          />
          Google
        </Button>
      </div>

      {/* Регистрация */}
      <Button
        className="w-full bg-accent text-accent-foreground 
                   hover:bg-accent/90 focus-visible:ring-accent 
                   transition-colors duration-200 cursor-pointer mt-2"
        onClick={() => {
          onSignUpClick?.()
        }}
      >
        Create New Account
      </Button>
    </>
  )
}

export default DialogSignInOptions
