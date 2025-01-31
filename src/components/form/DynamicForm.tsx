import React, { memo, useState, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CustomTextInput,
  CustomTextarea,
  CustomSelect,
  CustomFileInput,
  CustomCheckbox,
} from "./../inputs";
import { DynamicFormProps, FormFieldProps } from "~/components/form/types";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import { isEqual } from "lodash";

const DynamicForm = forwardRef<
  { triggerValidation: () => Promise<boolean> },
  DynamicFormProps
>(({ fields, onChange, onChangeError, defaultValues }, ref) => {
  const {
    control,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const [tempErrors, setTempErrors] = useState<FieldErrors<unknown>>({});
  if (!isEqual(tempErrors, errors)) {
    onChangeError(errors);
    setTempErrors({ ...errors });
  }

  React.useEffect(() => {
    const { unsubscribe } = watch((value) => {
      onChange(value);
    });
    return () => unsubscribe();
  }, [watch]);

  // Expose the `trigger` function to the parent component
  useImperativeHandle(ref, () => ({
    triggerValidation: async () => {
      return await trigger(); // Trigger validation for all fields
    },
  }));

  const renderField = (field: FormFieldProps) => {
    const {
      name,
      type,
      label,
      id,
      options,
      required,
      validation,
      errorText,
      checkboxes,
    } = field;

    const fieldId = id; // Ensure every input has an ID

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
                errorText={errors[id]?.message as string}
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
                errorText={errors[id]?.message as string}
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
                errorText={errors[id]?.message as string}
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
                if (
                  file?.size &&
                  validation?.maxSize &&
                  file?.size > validation.maxSize
                ) {
                  return `File size exceeds ${validation.maxSize / 1024 / 1024}MB`;
                }

                return true;
              },
            }}
            render={({ field: { onChange, value, ...rest } }) => (
              <CustomFileInput
                {...rest}
                onChange={(e) => {
                  if (!e) return onChange(null);
                  const file = e.target.files?.[0];
                  onChange(file); // Pass the file object to the form
                }}
                accept={validation?.fileType?.join(", ")}
                id={fieldId}
                value={value}
                label={label}
                errorText={errors[id]?.message as string}
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
                checkboxes={(checkboxes ?? [])?.map((cb) => ({
                  ...cb,
                  id: cb.value || cb.label,
                }))}
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
      {fields?.map((field) => <div key={field.id}>{renderField(field)}</div>)}
    </div>
  );
});

export default memo(DynamicForm);
