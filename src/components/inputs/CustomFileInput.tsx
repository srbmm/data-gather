import {
    FileInput,
    type FileInputProps,
    Label
} from "flowbite-react";

interface Props extends FileInputProps{
    errorText?: string;
    label?: string;
}
export const CustomFileInput = (props: Props) => {
    return <div className="flext flex-col p-1 gap-1">
        { props?.label && <Label htmlFor={props.id}>{props?.label}</Label> }
        <FileInput {...props} />
        {props.errorText && <span className="text-red-500">{props.errorText}</span>}
    </div>
}