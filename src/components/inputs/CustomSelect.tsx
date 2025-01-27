import { Label, Select, type SelectProps } from "flowbite-react";
import {type OptionType} from "~/types";

interface Props extends SelectProps{
    errorText?: string;
    label?: string;
    options: OptionType[];
}

export function CustomSelect(props: Props) {
    const mappedOption = props.options.map(option =>
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
