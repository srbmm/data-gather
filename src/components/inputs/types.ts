import type {CheckboxProps, FileInputProps, SelectProps, TextareaProps, TextInputProps} from "flowbite-react";
import type {OptionType} from "~/types";
import {FieldErrors} from "react-hook-form/dist/types/errors";

interface CustomCheckboxProps extends CheckboxProps {
    label?: string;
}

export  interface CustomCheckBoxesProps {
    errorText?: string;
    label?: string;
    checkboxes: CustomCheckboxProps[];
    checked: Record<string, boolean>;
    onChange?: (value: Record<string, boolean>) => void;
}

export interface CustomFileInputProps extends FileInputProps{
    errorText?: string;
    label?: string;
}

export interface CustomSelectProps extends SelectProps{
    errorText?: string;
    label?: string;
    options: OptionType[];
}

export interface CustomTextareaProps extends TextareaProps{
    errorText?: string;
    label?: string;
}

export interface CustomTextInputProps extends TextInputProps{
    errorText?: string;
    label?: string;
}