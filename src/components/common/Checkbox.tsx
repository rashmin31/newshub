// src/components/common/Checkbox.tsx
import { InputHTMLAttributes } from "react";

interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

const Checkbox = ({ label, className = "", ...props }: CheckboxProps) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                className={`
                    h-4 w-4 text-blue-600 rounded
                    border-gray-300 focus:ring-blue-500
                    dark:border-gray-600 dark:bg-gray-700
                    ${className}
                `}
                {...props}
            />
            {label && (
                <span className="ml-3 text-gray-900 dark:text-gray-200">
                    {label}
                </span>
            )}
        </label>
    );
};

export default Checkbox;
