// AdminPanel.tsx
import React, { useState } from "react";
import { Form, FormField } from "./../../types";

const AdminPanel: React.FC = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Add a new form
    const addForm = () => {
        const newForm: Form = {
            id: `form-${Date.now()}`,
            name: `Form ${forms.length + 1}`,
            topic: "", // Initialize topic
            description: "",
            fields: [],
        };
        setForms([...forms, newForm]);
        setSelectedForm(newForm);
        setIsEditing(true);
    };

    // Edit an existing form
    const editForm = (form: Form) => {
        setSelectedForm(form);
        setIsEditing(true);
    };

    // Delete a form
    const deleteForm = (formId: string) => {
        setForms(forms.filter((form) => form.id !== formId));
        if (selectedForm?.id === formId) {
            setSelectedForm(null);
            setIsEditing(false);
        }
    };

    // Save changes to a form
    const saveForm = (updatedForm: Form) => {
        setForms(forms.map((form) => (form.id === updatedForm.id ? updatedForm : form)));
        setIsEditing(false);
    };

    // Add a new field to the selected form
    const addField = () => {
        if (!selectedForm) return;

        const newField: FormField = {
            id: `field-${Date.now()}`,
            name: `field_${selectedForm.fields.length + 1}`, // Initialize field name
            type: "text",
            label: "New Field",
        };

        const updatedForm = {
            ...selectedForm,
            fields: [...selectedForm.fields, newField],
        };

        setSelectedForm(updatedForm);
        saveForm(updatedForm);
    };

    // Edit a field in the selected form
    const editField = (fieldId: string, updatedField: FormField) => {
        if (!selectedForm) return;

        const updatedFields = selectedForm.fields.map((field) =>
            field.id === fieldId ? updatedField : field
        );

        const updatedForm = {
            ...selectedForm,
            fields: updatedFields,
        };

        setSelectedForm(updatedForm);
        saveForm(updatedForm);
    };

    // Delete a field from the selected form
    const deleteField = (fieldId: string) => {
        if (!selectedForm) return;

        const updatedFields = selectedForm.fields.filter((field) => field.id !== fieldId);

        const updatedForm = {
            ...selectedForm,
            fields: updatedFields,
        };

        setSelectedForm(updatedForm);
        saveForm(updatedForm);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

            {/* Form List */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Forms</h2>
                <button
                    onClick={addForm}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    Add New Form
                </button>
                <ul>
                    {forms.map((form) => (
                        <li key={form.id} className="flex items-center justify-between mb-2">
                            <span>{form.name}</span>
                            <div>
                                <button
                                    onClick={() => editForm(form)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteForm(form.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Form Editor */}
            {isEditing && selectedForm && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Edit Form: {selectedForm.name}</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Form Name</label>
                        <input
                            type="text"
                            value={selectedForm.name}
                            onChange={(e) =>
                                setSelectedForm({ ...selectedForm, name: e.target.value })
                            }
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Form Topic</label>
                        <input
                            type="text"
                            value={selectedForm.topic}
                            onChange={(e) =>
                                setSelectedForm({ ...selectedForm, topic: e.target.value })
                            }
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Form Description</label>
                        <textarea
                            value={selectedForm.description}
                            onChange={(e) =>
                                setSelectedForm({ ...selectedForm, description: e.target.value })
                            }
                            className="border p-2 w-full"
                        />
                    </div>

                    {/* Fields List */}
                    <h3 className="text-lg font-semibold mb-4">Fields</h3>
                    <button
                        onClick={addField}
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Add New Field
                    </button>
                    <ul>
                        {selectedForm.fields.map((field) => (
                            <li key={field.id} className="mb-4 p-4 border rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <span>{field.label}</span>
                                    <div>
                                        <button
                                            onClick={() => deleteField(field.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Field Name</label>
                                    <input
                                        type="text"
                                        value={field.name}
                                        onChange={(e) =>
                                            editField(field.id, { ...field, name: e.target.value })
                                        }
                                        className="border p-2 w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Field Label</label>
                                    <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) =>
                                            editField(field.id, { ...field, label: e.target.value })
                                        }
                                        className="border p-2 w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Field Type</label>
                                    <select
                                        value={field.type}
                                        onChange={(e) =>
                                            editField(field.id, {
                                                ...field,
                                                type: e.target.value as FormField["type"],
                                            })
                                        }
                                        className="border p-2 w-full"
                                    >
                                        <option value="text">Text</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="select">Select</option>
                                        <option value="file">File</option>
                                        <option value="checkbox">Checkbox</option>
                                    </select>
                                </div>
                                {/* Add more field-specific settings here */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;