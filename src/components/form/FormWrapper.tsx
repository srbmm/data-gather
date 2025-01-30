import {FormWrapperProps} from "~/components/form/types";
import {DynamicForm} from "~/components/form/DynamicForm";

export const FormWrapper: React.FC<FormWrapperProps> = ({fields, onChange, onChangeError, topic, description}) => {
    return (
        <div className="w-full flex flex-col gap-2">
                <h3 className="text-xl font-bold">{topic}</h3>
                <p>{description}</p>
                <DynamicForm fields={fields} onChange={onChange} onChangeError={onChangeError} />
        </div>
    );
};

