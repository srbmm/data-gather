import {
    Textarea,
    type TextareaProps,
    Label
} from "flowbite-react";

interface Props extends TextareaProps{
    errorText?: string;
    label?: string;
}
export const CustomTextarea = (props: Props) => {
    return <div className="flext flex-col p-1 gap-1">
        { props?.label && <Label htmlFor={props.id}>{props?.label}</Label> }
        <Textarea {...props} />
        {props.errorText && <span className="text-red-500">{props.errorText}</span>}
    </div>
}