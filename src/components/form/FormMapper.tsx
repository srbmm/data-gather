import { DynamicFormRef, FormMapperProps } from "~/components/form/types";
import FormWrapper from "~/components/form/FormWrapper";
import { useCallback, useState, memo, useRef } from "react";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import { FormsData, FormsError } from "~/types";
import { Alert } from "flowbite-react";

const FormMapper: React.FC<FormMapperProps> = ({ forms, onSubmit }) => {
  const [errors, setErrors] = useState<FormsError>({});
  const [formsData, setFormsData] = useState<FormsData>({});
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "failure">("failure");

  // Create a ref for each form
  const formRefs = useRef<Record<string, DynamicFormRef | null>>({});


  const onChangeErrorHandler = useCallback(
    (formName: string) => (error: FieldErrors<unknown>) => {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors, [formName]: error };
        // onChangeError(newErrors);
        return newErrors;
      });
    },
    [],
  );

  const onChangeHandler = useCallback(
    (formName: string) => (data: Record<string, unknown>) => {
      setFormsData((prevFormsData) => {
        const newFormsData = { ...prevFormsData, [formName]: data };
        // onChange(newFormsData);
        return newFormsData;
      });
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    let hasErrors = false;
    const allErrors: FormsError = {};

    // Trigger validation for all forms
    for (const form of forms) {
      const formRef = formRefs.current[form.name];
      if (formRef) {
        const isValid = await formRef.triggerValidation();
        if (!isValid) {
          hasErrors = true;
          // Collect errors for this form
          allErrors[form.name] = errors[form.name] || {};
        }
      }
    }

    // If there are errors, display them
    if (hasErrors) {
      setErrors(allErrors);
      setAlertMessage("Please fix the errors.");
      setAlertType("failure");
      return;
    }

    // If no errors, call the `onSubmit` prop with the collected form data
    if (onSubmit) {
      onSubmit(formsData);
      setAlertMessage("Form submitted successfully!");
      setAlertType("success");
    }
  }, [errors, formsData, onSubmit, forms]);

  const mappedForms = forms.map((form) => (
    <div key={form.id} className="flex w-full items-center justify-center">
      <FormWrapper
        topic={form.topic}
        description={form.description}
        fields={form.fields}
        defaultValues={formsData[form.name] ?? {}}
        onChange={onChangeHandler(form.name)}
        onChangeError={onChangeErrorHandler(form.name)}
        ref={(ref) => (formRefs.current[form.name] = ref)} // Pass the ref to FormWrapper
      />
    </div>
  ));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full flex-col items-center gap-3">
        {mappedForms}
      </div>

      {alertMessage && (
        <Alert
          color={alertType === "success" ? "success" : "failure"}
          onDismiss={() => setAlertMessage(null)}
        >
          {alertMessage}
        </Alert>
      )}
      <button
        onClick={handleSubmit}
        className="w-full max-w-96 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
};

export default memo(FormMapper);
