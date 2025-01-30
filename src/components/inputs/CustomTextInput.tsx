import {
    TextInput,
    type TextInputProps,
    Label
} from "flowbite-react";
import {CustomTextInputProps} from "~/components/inputs/types";

export const CustomTextInput = (props: CustomTextInputProps) => {
        return <div className="flext flex-col p-1 gap-1">
            { props?.label && <Label htmlFor={props.id}>{props?.label}</Label> }
            <TextInput {...props} />
            {props.errorText && <span className="text-red-500">{props.errorText}</span>}
        </div>
}