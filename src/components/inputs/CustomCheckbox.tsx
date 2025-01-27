import { Checkbox, Label, type CheckboxProps } from "flowbite-react";

interface Props {
    errorText?: string;
    label?: string;
    checkboxes: CheckboxProps[];
    checked: { [key: string]: boolean };
    onChange?: (value: { [key: string]: boolean }) => void;
}

export const CustomCheckbox = (props: Props) => {
    // Compute check values
    const computedChecked: { [key: string]: boolean } = {};
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

    const mappedCheckboxes = props.checkboxes.map((item) => (
        <Checkbox
            key={item.id}
            {...item}
            checked={computedChecked[item.id] || false}
            onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
        />
    ));

    return (
        <div className="flex flex-col p-1 gap-1">
            {props.label && <Label>{props.label}</Label>}
            {mappedCheckboxes}
            {props.errorText && <span className="text-red-500">{props.errorText}</span>}
        </div>
    );
};
