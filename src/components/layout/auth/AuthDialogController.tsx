"use client"
import { LoginModal } from './LoginModal';

type AuthDialogControllerProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const AuthDialogController = ({ open, setOpen }: AuthDialogControllerProps) => {
  return (
    <LoginModal open={!!open} onOpenChange={setOpen || (() => {})} />
  );
};

export default AuthDialogController;