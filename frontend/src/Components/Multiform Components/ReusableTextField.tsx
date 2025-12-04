import {
  type Control,
  type FieldValues,
  Controller,
  useWatch,
} from "react-hook-form";
import { Country, City } from "country-state-city";
import { useState } from "react";

export interface ImageWithName {
  name: string;
  image: File;
}

interface Option {
  label: string;
  value: string | number;
}

interface ControlledTextFieldProps {
  name: string;
  label: string;
  type?: string | undefined;
  options?: Option[];
  control: Control<FieldValues>;
  rules?: object;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  accept?: string;
}

const ReusableTextField = ({
  name,
  label,
  type = "text",
  control,
  rules,
  options = [],
  placeholder,
  disabled,
  className = "",
  accept,
}: ControlledTextFieldProps) => {
  const isCountry = name === "country";
  const isCity = name === "city";

  const selectedCountry = useWatch({
    control,
    name: "country",
  });

  // Local UI-only state for real files
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  // Build options dynamically for country & city selectors
  const cityOptions = selectedCountry
    ? City.getCitiesOfCountry(selectedCountry)?.map((c) => ({
        label: c.name,
        value: c.name,
      })) ?? []
    : [];

  let displayOptions = options;
  if (isCountry) {
    displayOptions = Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
    }));
  }
  if (isCity) displayOptions = cityOptions;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const baseClassName = `w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 
                text-gray-900 shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#FF385C]/30 
                focus:border-[#FF385C] transition-all 
                ${error ? "border-red-500" : ""}`;

        return (
          <div className={`flex flex-col space-y-2.5 ${className}`}>
            <label className="text-gray-800 font-semibold text-sm tracking-wide">
              {label}
            </label>

            {/* SELECT FIELD */}
            {type === "select" && (
              <select {...field} disabled={disabled} className={baseClassName}>
                <option value="">Select {label}</option>
                {displayOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* TEXTAREA FIELD */}
            {type === "textarea" && (
              <textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                className={`${baseClassName} h-32 resize-none`}
              />
            )}

            {/* CHECKBOX FIELD */}
            {type === "checkbox" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {displayOptions.map((opt) => {
                  const values = Array.isArray(field.value) ? field.value : [];

                  return (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer 
                                bg-white border rounded-lg p-3 hover:shadow-md"
                    >
                      <input
                        type="checkbox"
                        checked={values.includes(opt.value)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...values, opt.value]
                            : values.filter((v) => v !== opt.value);
                          field.onChange(updated);
                        }}
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* FILE UPLOAD FIELD */}
            {type === "file" && (
              <div className="space-y-4">
                {/* Thumbnails + Editing Names */}
                {Array.isArray(field.value) &&
                  field.value.map((item: ImageWithName, idx: number) => {
                    const file = localFiles[idx];
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 border p-4 rounded-xl bg-white shadow-sm"
                      >
                        <img
                          src={file ? URL.createObjectURL(file) : ""}
                          className="w-24 h-24 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...field.value];
                              updated[idx].name = e.target.value;
                              field.onChange(updated);
                            }}
                            className="border rounded-lg px-3 py-2 w-full"
                          />
                        </div>

                        <button
                          type="button"
                          className="bg-red-500 text-white px-3 py-2 rounded-full"
                          onClick={() => {
                            field.onChange(
                              field.value.filter((_: any, i: number) => i !== idx)
                            );
                            setLocalFiles((prev) =>
                              prev.filter((_: File, i: number) => i !== idx)
                            );
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}

                <label className="border-2 border-dashed border-gray-300 rounded-xl 
                      flex justify-center items-center h-32 cursor-pointer
                      hover:border-[#FF385C] hover:bg-[#FF385C]/5">
                  <span className="text-lg text-gray-500">+ Upload Images</span>

                  <input
                    type="file"
                    accept={accept || "image/*"}
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      const current = field.value || [];

                      if (current.length + files.length > 5) {
                        alert("Max 5 images allowed.");
                        return;
                      }

                      setLocalFiles((prev) => [...prev, ...files]);

                      const newMetadata = files.map((file) => ({
                        name: file.name.replace(/\.[^/.]+$/, ""),
                        image: file,
                      }));

                      field.onChange([...current, ...newMetadata]);
                    }}
                  />
                </label>
              </div>
            )}

            {/* DEFAULT INPUT */}
            {["text", "number"].includes(type) && (
              <input
                {...field}
                type={type}
                min={type === "number" ? 0 : undefined}
                placeholder={placeholder}
                disabled={disabled}
                className={baseClassName}
              />
            )}

            {/* Validation Error */}
            {error && (
              <p className="text-red-500 text-sm">{error.message as string}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default ReusableTextField;
