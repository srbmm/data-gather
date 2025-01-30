import { Label, Select } from "flowbite-react";
import {CustomSelectProps} from "~/components/inputs/types";



export function CustomSelect(props: CustomSelectProps) {
    const mappedOption = props.options?.map(option =>
        <option key={option.value} value={option.value}>{option.label}</option>
    )

    return (
        <div className="flext flex-col p-1 gap-1">
            { props?.label && <Label htmlFor={props.id}>{props?.label}</Label> }
            <Select {...props}>
                {mappedOption}
            </Select>
            {props.errorText && <span className="text-red-500">{props.errorText}</span>}
        </div>
    );
}
