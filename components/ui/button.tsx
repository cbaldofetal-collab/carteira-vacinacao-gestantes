import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary'
    size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-secondary text-white hover:bg-secondary/90",
            outline: "border border-border bg-background hover:bg-muted",
            ghost: "hover:bg-muted",
            secondary: "bg-muted text-foreground hover:bg-muted/80"
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3 text-sm",
            lg: "h-11 rounded-md px-8"
        }

        return (
            <button
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
