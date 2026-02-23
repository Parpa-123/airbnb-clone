import type { UseFormRegister, RegisterOptions } from "react-hook-form";

interface FormInputProps {
    label: string;
    name: string;
    register: UseFormRegister<any>;
    options?: RegisterOptions;
    type?: "text" | "number";
    className?: string;
}

export function FormInput({
    label,
    name,
    register,
    options,
    type = "text",
    className = "",
}: FormInputProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                {...register(name, options)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition-all"
            />
        </div>
    );
}

interface SelectOption {
    value: string | number;
    label: string;
}

interface FormSelectProps {
    label: string;
    name: string;
    register: UseFormRegister<any>;
    options?: RegisterOptions;
    selectOptions?: SelectOption[];
    className?: string;
}

export function FormSelect({
    label,
    name,
    register,
    options,
    selectOptions = [],
    className = "",
}: FormSelectProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <select
                {...register(name, options)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] transition-all bg-white"
            >
                {selectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

interface FormCheckboxProps {
    label: string;
    name: string;
    register: UseFormRegister<any>;
}

export function FormCheckbox({ label, name, register }: FormCheckboxProps) {
    return (
        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:border-[#22C55E] hover:bg-gray-50 transition-all cursor-pointer">
            <input
                type="checkbox"
                {...register(name)}
                className="w-4 h-4 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E] focus:ring-2"
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}

interface FormTextareaProps {
    label: string;
    name: string;
    register: UseFormRegister<any>;
    rows?: number;
    className?: string;
}

export function FormTextarea({
    label,
    name,
    register,
    rows = 5,
    className = "",
}: FormTextareaProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <textarea
                {...register(name)}
                rows={rows}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all resize-none"
            />
        </div>
    );
}
