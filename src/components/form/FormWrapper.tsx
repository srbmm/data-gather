import React, {forwardRef, memo} from "react";
import { FormWrapperProps } from "~/components/form/types";
import DynamicForm from "~/components/form/DynamicForm";
import { Card } from "flowbite-react";

const FormWrapper = forwardRef<{ triggerValidation: () => Promise<boolean> }, FormWrapperProps>(
    ({ fields, onChange, onChangeError, topic, description, defaultValues }, ref) => {
        return (
            <Card className="flex w-full flex-col gap-2">
                <h3 className="text-xl font-bold">{topic}</h3>
                <p className="text-sm">{description}</p>
                <DynamicForm
                    ref={ref} // Forward the ref to DynamicForm
                    defaultValues={defaultValues}
                    fields={fields}
                    onChange={onChange}
                    onChangeError={onChangeError}
                />
            </Card>
        );
    }
);

export default memo(FormWrapper);