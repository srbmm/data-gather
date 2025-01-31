import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import {
  Modal,
  Button,
  TextInput,
  Select,
  Checkbox,
  Label,
  Textarea,
} from "flowbite-react";
import { api } from "~/utils/api";
import { strToLabelValue } from "~/utils/strToLabelValue";

// Ensure you have these imports for handling the form and field data
interface FormField {
  _id: string;
  name: string;
  label?: string;
  type: "text" | "textarea" | "select" | "file" | "checkbox";
  options?: { value: string; label: string }[];
  required?: boolean;
  validation?: {
    regex?: string;
    maxSize?: number;
    fileType?: string;
  };
  checkboxes?: { value: string; label: string }[];
}

interface FormData {
  _id: string;
  name: string;
  topic: string;
  description: string;
  fields: FormField[];
}

const FieldEditor = ({
  index,
  field,
  register,
  control,
  remove,
  setValue,
}: any) => {
  const type = useWatch({
    control,
    name: `fields.${index}.type`, // Watch type field
  });

  return (
    <div key={field._id ?? field.name} className="mt-2 rounded-md border p-2">
      <TextInput
        {...register(`fields.${index}.name`, { required: true })}
        placeholder="Field Name"
      />
      <TextInput
        {...register(`fields.${index}.label`)}
        placeholder="Field Label"
        className="mt-2"
      />

      <Controller
        control={control}
        name={`fields.${index}.type`}
        render={({ field }) => (
          <Select {...field} className="mt-2 w-full">
            <option value="text">Text</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="file">File</option>
            <option value="checkbox">Checkbox</option>
          </Select>
        )}
      />

      <div className="mt-2 flex items-center gap-2">
        <Controller
          control={control}
          name={`fields.${index}.required`}
          render={({ field }) => <Checkbox {...field} label="Required" />}
        />
        <Label htmlFor={`fields.${index}.label`}>Required</Label>
      </div>

      {type === "text" && (
        <TextInput
          {...register(`fields.${index}.validation.regex`)}
          placeholder="Regex Validation"
          className="mt-2"
        />
      )}

      {type === "file" && (
        <>
          <Controller
            name={`fields.${index}.validation.maxSize`}
            control={control}
            render={({ field }) => (
              <TextInput
                type="number"
                {...field}
                placeholder="Max File Size (KB)"
                className="mt-2"
                onChange={(e) => {
                  // Cast the value to a number
                  field.onChange(Number(e.target.value));
                }}
              />
            )}
          />
          <TextInput
            {...register(`fields.${index}.validation.fileType`)}
            placeholder="Allowed File Types (comma separated)"
            className="mt-2"
          />
        </>
      )}

      {type === "select" && (
        <Controller
          control={control}
          name={`fields.${index}.options`}
          render={({ field }) => (
            <TextInput
              {...field}
              value={field.value?.map((option: any) => option.value).join(", ")} // Convert array to comma-separated string
              placeholder="Options (comma separated)"
              className="mt-2"
              onChange={(e) => {
                const options = strToLabelValue(e.target.value);
                setValue(`fields.${index}.options`, options); // Update form state with parsed options
              }}
            />
          )}
        />
      )}

      {type === "checkbox" && (
        <Controller
          control={control}
          name={`fields.${index}.checkboxes`}
          render={({ field }) => (
            <TextInput
              {...field}
              value={field.value
                ?.map((checkbox: any) => checkbox.value)
                .join(", ")} // Convert array to comma-separated string
              placeholder="Checkbox Items (comma separated)"
              className="mt-2"
              onChange={(e) => {
                const checkboxes = strToLabelValue(e.target.value);
                setValue(`fields.${index}.checkboxes`, checkboxes); // Update form state with parsed checkboxes
              }}
            />
          )}
        />
      )}

      <Button color="failure" onClick={() => remove(index)} className="mt-2">
        Remove
      </Button>
    </div>
  );
};

const FormManager = () => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [currentForm, setCurrentForm] = useState<FormData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: formsData } = api.form.getAll.useQuery();

  const { register, handleSubmit, control, reset, setValue } =
    useForm<FormData>({ defaultValues: { fields: [] } });
  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  // Mutation to update all forms
  const mutation = api.form.updateAll.useMutation();

  const openModal = (form?: FormData) => {
    setCurrentForm(form || null);
    reset(form || { fields: [] });
    setModalOpen(true);
  };
  useEffect(() => {
    if (!formsData) return;
    setForms(formsData);
  }, [formsData]);

<<<<<<< HEAD
  const onSubmit = (data: FormData) => {
    if (currentForm) {
      setForms((prev) =>
        prev.map((form) =>
          form._id === currentForm._id
            ? {
                ...data,
                _id: currentForm._id,
                fields: data.fields,
              }
            : form,
        ),
      );
    } else {
      setForms((prev) => [...prev, { ...data }]);
    }
    setModalOpen(false);
  };
=======
    const createManyForms = api.form.createMany.useMutation();
    const handleCreateForms = () => { 
        createManyForms.mutate(forms); 
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-center">Manage Forms</h2>
            <Button onClick={() => openModal()}>Create New Form</Button>
>>>>>>> 32a236449d21f7b1c2109608845b1dfdfdd51024

  const deleteForm = (id: string) => {
    setForms(forms.filter((form) => form._id !== id));
  };

  const saveConfiguration = async () => {
    try {
      await mutation.mutateAsync(forms); // Call the mutation to update all forms
      console.log("Forms updated successfully");
    } catch (error) {
      console.error("Error updating forms:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-center text-xl font-bold">Manage Forms</h2>
      <Button onClick={() => openModal()}>Create New Form</Button>

      <div className="mt-4">
        {forms.map((form) => {
          return (
            <div
              key={form._id ?? form.name}
              className="mb-2 rounded-md border p-4 shadow-md"
            >
              <h3 className="text-lg font-semibold">{form.name}</h3>
              <p>{form.description}</p>
              <div className="mt-2 flex gap-2">
                <Button onClick={() => openModal(form)}>Edit</Button>
                <Button color="failure" onClick={() => deleteForm(form._id)}>
                  Delete
                </Button>
              </div>
            </div>
<<<<<<< HEAD
          );
        })}
      </div>
      <Button onClick={saveConfiguration} disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save Configuration"}
      </Button>
      <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Create/Edit Form</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              {...register("name", { required: true })}
              placeholder="Form Name"
            />
            <TextInput
              {...register("topic")}
              placeholder="Topic"
              className="mt-2"
            />
            <Textarea
              {...register("description")}
              placeholder="Description"
              className="mt-2"
            ></Textarea>
=======
            <Button onClick={handleCreateForms}>Save</Button>
            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Header>Create/Edit Form</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextInput {...register("name", { required: true })} placeholder="Form Name" />
                        <TextInput {...register("topic")} placeholder="Topic" className="mt-2" />
                        <Textarea {...register("description")} placeholder="Description" className="mt-2"></Textarea>
>>>>>>> 32a236449d21f7b1c2109608845b1dfdfdd51024

            {fields.map((field, index) => (
              <FieldEditor
                key={field.name}
                setValue={setValue}
                index={index}
                field={field}
                register={register}
                control={control}
                remove={remove}
              />
            ))}

            <Button
              onClick={() =>
                append({ name: "", type: "text" })
              }
              className="mt-4 w-full"
            >
              Add Field
            </Button>
            <Button type="submit" className="mt-4 w-full">
              Save Form
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormManager;
