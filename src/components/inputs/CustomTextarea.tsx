import {
    Textarea,
    type TextareaProps,
    Label
} from "flowbite-react";
import {CustomTextareaProps} from "~/components/inputs/types";


export const CustomTextarea = (props: CustomTextareaProps) => {
    return <div className="flext flex-col p-1 gap-1">
        { props?.label && <Label htmlFor={props.id}>{props?.label}</Label> }
        <Textarea {...props} />
        {props.errorText && <span className="text-red-500">{props.errorText}</span>}
    </div>
}