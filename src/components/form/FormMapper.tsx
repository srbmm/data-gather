import { FormMapperProps } from "~/components/form/types";
import { FormWrapper } from "~/components/form/FormWrapper";
import { useCallback, useState, memo } from "react";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import { FormsData, FormsError } from "~/types";

// Wrap the component with React.memo
export const FormMapper: React.FC<FormMapperProps> = memo(({
                                                             forms,
                                                             onChangeError,
                                                             onChange,
                                                           }) => {
  const [errors, setErrors] = useState<FormsError>({});
  const [formsData, setFormsData] = useState<FormsData>({});

  // Memoized onChangeErrorHandler
  const onChangeErrorHandler = useCallback(
      (formName: string) => (error: FieldErrors<unknown>) => {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors, [formName]: error };
          onChangeError(newErrors); // Pass the updated errors to the parent
          return newErrors;
        });
      },
      [onChangeError]
  );

  // Memoized onChangeHandler
  const onChangeHandler = useCallback(
      (formName: string) => (data: Record<string, unknown>) => {
        setFormsData((prevFormsData) => {
          const newFormsData = { ...prevFormsData, [formName]: data };
          onChange(newFormsData); // Pass the updated forms data to the parent
          return newFormsData;
        });
      },
      [onChange]
  );

  const mappedForms = forms?.map((form) => {
    console.log(form);

    return (
        <FormWrapper
            key={form.id}
            topic={form.topic}
            description={form.description}
            fields={form.fields}
            onChange={() => onChangeHandler(form.name)}
            onChangeError={() => onChangeErrorHandler(form.name)}
        />
    );
  });

  console.log(mappedForms);

  return (
      <div className="flex w-full flex-col gap-3">
        {mappedForms}
      </div>
  );
});