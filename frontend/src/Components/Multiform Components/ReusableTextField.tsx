import { type Control, type FieldValues, Controller } from "react-hook-form";

interface Option {
    label: string;
    value: string | number;
}

interface ControlledTextFieldProps {
    name: string;
    label: string;
    type?: string;
    options?: Option[];
    control: Control<FieldValues>;
    rules?: object;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const ReusableTextField: React.FC<ControlledTextFieldProps> = ({
    name,
    label,
    type = "text",
    options = [],
    placeholder,
    disabled,
    className = "",
    control,
    rules,
}) => {
    const isSelect = type === "select";
    const isTextarea = type === "textarea";

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <div className={`flex flex-col space-y-1 ${className}`}>
                    <label
                        htmlFor={name}
                        className="text-gray-700 font-medium"
                    >
                        {label}
                    </label>

                    {isSelect ? (
                        <select
                            {...field}
                            disabled={disabled}
                            className={`w-full bg-white 
                                border border-gray-300 
                                rounded-lg px-3 py-2
                                text-gray-900
                                focus:ring-2 focus:ring-[#FF385C]/40 
                                focus:border-[#FF385C]
                                ${error ? "border-red-500" : ""}
                            `}
                        >
                            <option value="">Select {label}</option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : isTextarea ? (
                        <textarea
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`w-full bg-white 
                                border border-gray-300 
                                rounded-lg px-3 py-2 h-32
                                text-gray-900 
                                focus:ring-2 focus:ring-[#FF385C]/40 
                                focus:border-[#FF385C]
                                ${error ? "border-red-500" : ""}
                            `}
                        />
                    ) : (
                        <input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`w-full bg-white 
                                border border-gray-300 
                                rounded-lg px-3 py-2
                                text-gray-900 
                                focus:ring-2 focus:ring-[#FF385C]/40 
                                focus:border-[#FF385C]
                                ${error ? "border-red-500" : ""}
                            `}
                        />
                    )}

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error.message as string}
                        </p>
                    )}
                </div>
            )}
        />
    );
};

export default ReusableTextField;
