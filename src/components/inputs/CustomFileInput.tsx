import {
    FileInput,
    type FileInputProps,
    Label
} from "flowbite-react";
import {CustomFileInputProps} from "~/components/inputs/types";


export const CustomFileInput = (props: CustomFileInputProps) => {
    return <div className="flext flex-col p-1 gap-1">
        { props?.label && <Label htmlFor={props.id}>{props?.label}</Label> }
        <FileInput {...props} />
        {props.errorText && <span className="text-red-500">{props.errorText}</span>}
    </div>
}