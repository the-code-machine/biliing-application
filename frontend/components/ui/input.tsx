import * as React from "react"

import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "./button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
   const [showPassword, setShowPassword] = React.useState(false)
   const disabled = props.value === "" || props.value === undefined || props.disabled
 
   return (
    <div className="relative">
     <Input
      type={showPassword ? "text" : "password"}
      className={cn("hide-password-toggle pr-10", className)}
      ref={ref}
      {...props}
     />
     <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
      onClick={() => setShowPassword((prev) => !prev)}
      disabled={disabled}
     >
      {showPassword && !disabled ? (
       <EyeIcon
        className="w-4 h-4"
        aria-hidden="true"
       />
      ) : (
       <EyeOffIcon
        className="w-4 h-4"
        aria-hidden="true"
       />
      )}
      <span className="sr-only">
       {showPassword ? "Hide password" : "Show password"}
      </span>
     </Button>
     <style>{`
      .hide-password-toggle::-ms-reveal,
      .hide-password-toggle::-ms-clear {
       visibility: hidden;
       pointer-events: none;
       display: none;
      }
     `}</style>
    </div>
   )
  },
 )
 PasswordInput.displayName = "PasswordInput"
 
 export { PasswordInput }

