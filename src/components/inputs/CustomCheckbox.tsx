import { Checkbox, Label } from "flowbite-react";
import {CustomCheckBoxesProps} from "~/components/inputs/types";



export const CustomCheckbox = (props: CustomCheckBoxesProps) => {
    // Compute check values
    const computedChecked: Record<string, boolean> = {};
    for (const item of props.checkboxes) {
        if (!item.id) return;
        let isChecked = props.checked[item.id];
        if (isChecked === undefined) isChecked = false;
        computedChecked[item.id] = isChecked;
    }

    // Handle checkbox state change
    const handleCheckboxChange = (id: string, isChecked: boolean) => {
        // Update the parent state by calling the onChange callback
        if (props.onChange) {
            // Make sure we are passing a new object to avoid mutating previous state
            props.onChange({ ...props.checked, [id]: isChecked });
        }
    };

    const mappedCheckboxes = props.checkboxes?.map((item) => (
        <div className="flex gap-1" key={item.id}>
            <Checkbox
                {...item}
                checked={computedChecked[item.id] || false}
                onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
            />
            <Label>{item.label}</Label>
        </div>
    ));
    return (
        <div className="flex flex-col p-1 gap-1">
            {props.label && <Label>{props.label}</Label>}
            {mappedCheckboxes}
            {props.errorText && <span className="text-red-500">{props.errorText}</span>}
        </div>
    );
};
