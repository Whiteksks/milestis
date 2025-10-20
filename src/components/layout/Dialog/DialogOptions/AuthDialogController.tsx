"use client"
import { useState } from 'react';
import DialogSignInOptions from './DialogOptions';
import DialogSignIn from '../DialogSignIn/DialogSignIn';
import DialogSignUp from '../DialogSignUp/DialogSignUp';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type AuthDialogControllerProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};


const AuthDialogController = ({ open, setOpen }: AuthDialogControllerProps) => {
  // step: 'options' | 'signin' | 'signup'
  const [step, setStep] = useState<'options' | 'signin' | 'signup'>('options');

  // Сброс шага при открытии/закрытии диалога
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => setStep("options"), 300);
    }
    if (setOpen) setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogContent className="bg-gradient-to-b from-accent to-card [background-size:100%_101%] sm:max-w-sm dark:from-accent">
        {step === 'options' && (
          <>
            <DialogHeader>
              <DialogTitle className='sr-only'>Authentication Options</DialogTitle>
              <DialogDescription className='sr-only'>
                Select a method to access your account or create a new one.
              </DialogDescription>
            </DialogHeader>
            <DialogSignInOptions 
              onSignInClick={() => setStep('signin')} 
              onSignUpClick={() => setStep('signup')} 
            />
          </>
        )}
        {step === 'signin' && (
          <>
            <DialogHeader>
              <DialogTitle className='sr-only'>Sign In</DialogTitle>
            </DialogHeader>
            <DialogSignIn onBack={() => setStep('options')} />
          </>
        )}
        {step === 'signup' && (
          <>
            <DialogHeader>
              <DialogTitle className='sr-only'>Sign Up</DialogTitle>
            </DialogHeader>
            <DialogSignUp onBack={() => setStep('options')} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialogController;