import {FieldErrors} from "react-hook-form/dist/types/errors";

export interface OptionType {
    label: string;
    value: string;
}

export interface FormField {
    id: string;
    name: string;
    type: "text" | "textarea" | "select" | "file" | "checkbox";
    label?: string;
    options?: { value: string; label: string }[]; // For select fields
    required?: boolean;
    validation?: {
        regex?: RegExp; // For text input
        maxSize?: number; // For files
        fileType?: string[]; // Allowed file types
    };
    checkboxes?: { value: string; label: string }[]; // For checkboxes
}

export interface Form {
    id: string;
    topic: string;
    description: string;
    fields: FormField[];
    name: string;
}


export type FormsError = Record<string, Record<string, FieldErrors<unknown>>>;
export type FormsData = Record<string, Record<string, unknown>>;