import { api } from "~/utils/api";


// query (get) to get all forms
const { data: forms, isLoading } = api.form.getAll.useQuery();
const { data: form, isLoading } = api.form.getOne.useQuery(id)


// mutation (post) to create a new form
const createForm = api.form.create.useMutation({
  onSuccess: () => {
    // what to do after successful mutation (optional)
  },
});


// even handler
const handleCreateForm = async (formData: any) => {
  try {
    await createForm.mutateAsync({
      topic: "My Topic",
      description: "My Description",
      name: "My Form",
      fields: [
        {
          id: crypto.randomUUID(),
          name: "firstName",
          type: "text",
          label: "First Name",
          required: true,
        }
        // ... other fields
      ],
    });
  } catch (error) {
    console.error('Error creating form:', error);
  }
};
