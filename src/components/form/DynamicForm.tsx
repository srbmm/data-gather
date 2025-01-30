import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
    CustomTextInput,
    CustomTextarea,
    CustomSelect,
    CustomFileInput,
    CustomCheckbox,
} from "./../inputs";
import {DynamicFormProps, FormFieldProps} from "~/components/form/types";



export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onChange, onChangeError }) => {
    const { control, watch, formState: { errors }, setValue } = useForm({
        mode: "onChange",
    });

   React.useEffect(() => {
        const { unsubscribe } = watch((value) => {
            onChange(value);
        })
        return () => unsubscribe()
    }, [watch])

    React.useEffect(() => {
        onChangeError(errors);
    }, [{...errors}])


    const renderField = (field: FormFieldProps) => {
        const { name, type, label, id, options, required, validation, errorText, checkboxes } = field;

        const fieldId = id ?? name; // Ensure every input has an ID

        switch (type) {
            case "text":
                return (
                    <Controller
                        name={id}
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
                                errorText={errors[id]?.message as string}
                            />
                        )}
                    />
                );
            case "textarea":
                return (
                    <Controller
                        name={id}
                        control={control}
                        rules={{
                            required: required ? `${label ?? name} is required` : undefined,
                        }}
                        render={({ field }) => (
                            <CustomTextarea
                                {...field}
                                id={fieldId}
                                label={label}
                                errorText={errors[id]?.message as string}
                            />
                        )}
                    />
                );
            case "select":
                return (
                    <Controller
                        name={id}
                        control={control}
                        rules={{
                            required: required ? `${label ?? name} is required` : undefined,
                        }}
                        render={({ field }) => (
                            <CustomSelect
                                {...field}
                                id={fieldId}
                                label={label}
                                errorText={errors[id]?.message as string}
                                options={options ?? []}
                            />
                        )}
                    />
                );
            case "file":
                return (
                    <Controller
                        name={id}
                        control={control}
                        rules={{
                            required: required ? `${label ?? name} is required` : undefined,
                            validate: (fileList: FileList) => {
                                const file = fileList?.[0];
                                console.log(validation?.fileType?.join(", "))
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
                                accept={validation?.fileType?.join(", ")}
                                id={fieldId}
                                label={label}
                                errorText={errors[id]?.message as string}
                            />
                        )}
                    />
                );
            case "checkbox":
                return (
                    <Controller
                        name={id}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <CustomCheckbox
                                label={label}
                                checkboxes={(checkboxes ?? [])?.map(cb => ({ ...cb, id: cb.value || cb.label }))}
                                checked={value ?? {}}
                                onChange={(updatedValue) => {
                                    onChange({ ...value, ...updatedValue });
                                }}
                                errorText={errors[id]?.message as string}
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
            {fields?.map((field) => (
                <div key={field.id}>{renderField(field)}</div>
            ))}
        </div>
    );
};
