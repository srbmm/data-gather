import { Form, FormField, FormsData, FormsError } from "~/types";
import { FieldErrors } from "react-hook-form/dist/types/errors";

export interface FormFieldProps extends FormField {
  errorText?: string;
}

export interface DynamicFormProps {
  fields: FormFieldProps[];
  onChange: (data: Record<string, unknown>) => void;
  onChangeError: (errors: FieldErrors<unknown>) => void;
  defaultValues: Record<string, unknown>;
}

export interface FormWrapperProps extends DynamicFormProps {
  topic: string;
  description: string;
}

export interface FormMapperProps {
  forms: Form[];
  onSubmit: (data: FormsData) => void;
}

export type DynamicFormRef = { triggerValidation: () => Promise<boolean> }