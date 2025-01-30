import { Button, FileInput, type FileInputProps, Label } from "flowbite-react";
import { CustomFileInputProps } from "~/components/inputs/types";

export const CustomFileInput = (props: CustomFileInputProps) => {
  return (
    <div className="flext flex-col gap-1 p-1">
      {props?.label && <Label htmlFor={props.id}>{props?.label}</Label>}
      {!props?.value ? (
        <FileInput {...props} value={undefined} />
      ) : (
        <div className="flex items-center gap-2">
          <span>
            <span className="font-bold">Selected File: </span>{" "}
            {(props.value as any)?.name}
          </span>
          <Button
            onClick={() => props?.onChange && props.onChange(null)}
            color="red"
            size="sm"
          >
            Remove
          </Button>
        </div>
      )}

      {props.errorText && (
        <span className="text-red-500">{props.errorText}</span>
      )}
    </div>
  );
};
