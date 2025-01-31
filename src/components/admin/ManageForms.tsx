import { useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import {Modal, Button, TextInput, Select, Checkbox, Label, Textarea} from "flowbite-react";
import { api } from "~/utils/api";

// Ensure you have these imports for handling the form and field data
interface FormField {
    id: string;
    name: string;
    label?: string;
    type: "text" | "textarea" | "select" | "file" | "checkbox";
    options?: { value: string; label: string }[];
    required?: boolean;
    validation?: {
        regex?: string;
        maxSize?: number;
        fileType?: string[];
    };
    checkboxes?: { value: string; label: string }[];
}

interface FormData {
    id: string;
    name: string;
    topic: string;
    description: string;
    fields: FormField[];
}

// Function to convert comma-separated string to array of LabelValue objects
export const strToLabelValue = (str: string): { label: string; value: string }[] => {
    return str.split(',').map((item) => ({ value: item.trim(), label: item.trim() }));
};
const FieldEditor = ({ index, field, register, control, remove, setValue }: any) => {
    const type = useWatch({
        control,
        name: `fields.${index}.type`, // Watch type field
    });

    return (
        <div key={field.id} className="border p-2 mt-2 rounded-md">
            <TextInput {...register(`fields.${index}.name`, { required: true })} placeholder="Field Name" />
            <TextInput {...register(`fields.${index}.label`)} placeholder="Field Label" className="mt-2" />

            <Controller
                control={control}
                name={`fields.${index}.type`}
                render={({ field }) => (
                    <Select {...field} className="w-full mt-2">
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
                    render={({ field }) => (
                        <Checkbox {...field} label="Required" />
                    )}
                />
                <Label htmlFor={`fields.${index}.label`}>Required</Label>
            </div>

            {type === "text" && (
                <TextInput {...register(`fields.${index}.validation.regex`)} placeholder="Regex Validation" className="mt-2" />
            )}

            {type === "file" && (
                <>
                    <TextInput type="number" {...register(`fields.${index}.validation.maxSize`)} placeholder="Max File Size (KB)" className="mt-2" />
                    <TextInput {...register(`fields.${index}.validation.fileType`)} placeholder="Allowed File Types (comma separated)" className="mt-2" />
                </>
            )}

            {/* For Select type field */}
            {type === "select" && (
                <Controller
                    control={control}
                    name={`fields.${index}.options`}
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            value={field.value?.map((option: any) => option.value).join(", ")}  // Convert array to comma-separated string
                            placeholder="Options (comma separated)"
                            className="mt-2"
                            onChange={(e) => {
                                // Convert the input string into LabelValue array
                                const options = strToLabelValue(e.target.value);
                                setValue(`fields.${index}.options`, options); // Update form state with parsed options
                            }}
                        />
                    )}
                />
            )}

            {/* For Checkbox type field */}
            {type === "checkbox" && (
                <Controller
                    control={control}
                    name={`fields.${index}.checkboxes`}
                    render={({ field }) => (
                        <TextInput
                            {...field}
                            value={field.value?.map((checkbox: any) => checkbox.value).join(", ")}  // Convert array to comma-separated string
                            placeholder="Checkbox Items (comma separated)"
                            className="mt-2"
                            onChange={(e) => {
                                // Convert the input string into LabelValue array
                                const checkboxes = strToLabelValue(e.target.value);
                                setValue(`fields.${index}.checkboxes`, checkboxes); // Update form state with parsed checkboxes
                            }}
                        />
                    )}
                />
            )}

            <Button color="failure" onClick={() => remove(index)} className="mt-2">Remove</Button>
        </div>
    );
};

const FormManager = () => {
    const [forms, setForms] = useState<FormData[]>([]);
    const [currentForm, setCurrentForm] = useState<FormData | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const { register, handleSubmit, control, reset, setValue } = useForm<FormData>({ defaultValues: { fields: [] } });
    const { fields, append, remove } = useFieldArray({ control, name: "fields" });

    const openModal = (form?: FormData) => {
        setCurrentForm(form || null);
        reset(form || { fields: [] });
        setModalOpen(true);
    };

    const onSubmit = (data: FormData) => {
        if (currentForm) {
            setForms((prev) => prev.map((form) => (form.id === currentForm.id ? { ...data, id: currentForm.id } : form)));
        } else {
            setForms((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
        }
        setModalOpen(false);
    };

    const deleteForm = (id: string) => {
        setForms(forms.filter((form) => form.id !== id));
    };

    const createManyForms = api.form.createMany.useMutation();
    const handleCreateForms = () => { 
        createManyForms.mutate(forms); 
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-center">Manage Forms</h2>
            <Button onClick={() => openModal()}>Create New Form</Button>

            <div className="mt-4">
                {forms.map((form) => (
                    <div key={form.id} className="border p-4 rounded-md shadow-md mb-2">
                        <h3 className="text-lg font-semibold">{form.name}</h3>
                        <p>{form.description}</p>
                        <div className="flex gap-2 mt-2">
                            <Button onClick={() => openModal(form)}>Edit</Button>
                            <Button color="failure" onClick={() => deleteForm(form.id)}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>
            <Button onClick={handleCreateForms}>Save</Button>
            <Modal show={isModalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Header>Create/Edit Form</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextInput {...register("name", { required: true })} placeholder="Form Name" />
                        <TextInput {...register("topic")} placeholder="Topic" className="mt-2" />
                        <Textarea {...register("description")} placeholder="Description" className="mt-2"></Textarea>

                        {fields.map((field, index) => (
                            <FieldEditor key={field.id} setValue={setValue} index={index} field={field} register={register} control={control} remove={remove} />
                        ))}

                        <Button onClick={() => append({ id: crypto.randomUUID(), name: "", type: "text" })} className="mt-4 w-full">Add Field</Button>
                        <Button type="submit" className="mt-4 w-full">Save Form</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FormManager;
