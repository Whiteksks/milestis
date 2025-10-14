import { LogInIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DialogSignUpProps = {
  onBack?: () => void;
};

const DialogSignUp = ({ onBack }: DialogSignUpProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded hover:bg-muted/40 transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <LogInIcon className="size-6 text-primary" />
          </div>
          <span className="text-lg font-semibold">Sign up for free</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <p className="text-center text-muted-foreground text-sm mb-4">
        Start your 60-day free trial now.
      </p>

      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" name="firstname" placeholder="John" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" name="lastname" placeholder="Doe" />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="useremail"
            placeholder="example@gmail.com"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="userpassword"
            placeholder="Password"
          />
        </div>
      </form>

      <Button
        className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary transition-colors"
      >
        Start your trial
      </Button>
    </>
  );
};

export default DialogSignUp;
