import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
    CustomTextInput,
    CustomTextarea,
    CustomSelect,
    CustomFileInput,
    CustomCheckbox,
} from "./../inputs"; // Import your custom components

interface FormField {
    name: string;
    type: "text" | "textarea" | "select" | "file" | "checkbox";
    label?: string;
    id?: string;
    options?: { value: string; label: string }[]; // For select fields
    required?: boolean;
    validation?: {
        regex?: RegExp;
        maxSize?: number; // For files
        fileType?: string[]; // Allowed file types
    };
    errorText?: string;
    checkboxes?: { id: string; label: string }[]; // For checkboxes
}

interface DynamicFormProps {
    fields: FormField[];
    onChange: (data: Record<string, any>) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onChange }) => {
    const { control, watch, formState: { errors }, setValue } = useForm({
        mode: "onChange",
    });

    const watchAllFields = watch();

    React.useEffect(() => {
        onChange(watchAllFields);
    }, [watchAllFields, onChange]);

    const renderField = (field: FormField) => {
        const { name, type, label, id, options, required, validation, errorText, checkboxes } = field;

        const fieldId = id ?? name; // Ensure every input has an ID

        switch (type) {
            case "text":
                return (
                    <Controller
                        name={name}
                        control={control}
                        rules={{
                            required: required ? `${label ?? name} is required` : undefined,
                            pattern: validation?.regex
                                ? {
                                    value: validation.regex,
                                    message: errorText ?? `Invalid ${label ?? name}`,
                                }
                                : undefined,
                        }}
                        render={({ field }) => (
                            <CustomTextInput
                                {...field}
                                id={fieldId}
                                label={label}
                                errorText={errors[name]?.message as string}
                            />
                        )}
                    />
                );
            case "textarea":
                return (
                    <Controller
                        name={name}
                        control={control}
                        rules={{
                            required: required ? `${label ?? name} is required` : undefined,
                        }}
                        render={({ field }) => (
                            <CustomTextarea
                                {...field}
                                id={fieldId}
                                label={label}
                                errorText={errors[name]?.message as string}
                            />
                        )}
                    />
                );
            case "select":
                return (
                    <Controller
                        name={name}
                        control={control}
                        rules={{
                            required: required ? `${label ?? name} is required` : undefined,
                        }}
                        render={({ field }) => (
                            <CustomSelect
                                {...field}
                                id={fieldId}
                                label={label}
                                errorText={errors[name]?.message as string}
                                options={options ?? []}
                            />
                        )}
                    />
                );
            case "file":
                return (
                    <Controller
                        name={name}
                        control={control}
                        rules={{
                            required: required ? `${label ?? name} is required` : undefined,
                            validate: (fileList: FileList) => {
                                const file = fileList?.[0];
                                if (file?.size && validation?.maxSize && file?.size > validation.maxSize) {
                                    return `File size exceeds ${validation.maxSize / 1024 / 1024}MB`;
                                }
                                if (
                                    validation?.fileType &&
                                    file &&
                                    !validation.fileType.includes(file.type)
                                ) {
                                    return `Invalid file type. Allowed types: ${validation.fileType.join(", ")}`;
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <CustomFileInput
                                {...field}
                                id={fieldId}
                                label={label}
                                errorText={errors[name]?.message as string}
                            />
                        )}
                    />
                );
            case "checkbox":
                return (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <CustomCheckbox
                                label={label}
                                checkboxes={(checkboxes ?? []).map(cb => ({ ...cb, id: cb.id || cb.label }))}
                                checked={value || {}}
                                onChange={(updatedValue) => {
                                    onChange({ ...value, ...updatedValue });
                                }}
                                errorText={errors[name]?.message as string}
                            />
                        )}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {fields.map((field) => (
                <div key={field.name}>{renderField(field)}</div>
            ))}
        </div>
    );
};
