// src/components/common/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    isLoading?: boolean;
}

const variants = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 
              dark:bg-blue-500 dark:hover:bg-blue-600`,
    secondary: `bg-gray-200 text-gray-900 hover:bg-gray-300 
                dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600`,
    outline: `border border-gray-200 dark:border-gray-700 bg-white 
              dark:bg-gray-800 text-gray-900 dark:text-white 
              hover:bg-gray-50 dark:hover:bg-gray-700`,
    ghost: `text-gray-600 dark:text-gray-400 hover:text-gray-900 
            dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`,
};

const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
};

const Button = ({
    variant = "primary",
    size = "md",
    className = "",
    disabled,
    isLoading,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`
                ${variants[variant]}
                ${sizes[size]}
                rounded-lg
                font-medium
                transition-colors
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${isLoading ? "cursor-wait" : ""}
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2" />
                    Loading...
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
