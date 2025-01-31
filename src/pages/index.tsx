import FormMapper from "~/components/form/FormMapper";
import {Form, FormsData} from "~/types";
import {RandomQuestion} from "~/components/other/RandomQuestion";
import { api } from "~/utils/api";

export default function  MultiFormPage () {
  const formFields = [
    {
      name: "firstName",
      id: "firstName",
      type: "text",
      label: "First Name",
      required: true,
      validation: {
        regex: /^[A-Za-z]+$/,
      },
      errorText: "Only letters are allowed",
    },
    {
      name: "lastName",
      id: "lastName",
      type: "text",
      label: "Last Name",
      required: true,
    },
    {
      name: "bio",
      id: "bio",
      type: "textarea",
      label: "Bio",
      required: true,
    },
    {
      name: "favoriteColor",
      id: "favoriteColor",
      type: "select",
      label: "Favorite Color",
      options: [
        { value: "red", label: "Red" },
        { value: "blue", label: "Blue" },
        { value: "green", label: "Green" },
      ],
      required: true,
    },
    {
      name: "profilePicture",
      id: "profilePicture",
      type: "file",
      label: "Profile Picture",
      validation: {
        maxSize: 5 * 1024 * 1024, // 5MB
        fileType: ["image/jpeg", "image/png"],
      },
    },
    {
      name: "newsletter",
      id: "newsletter",
      type: "checkbox",
      label: "Subscribe to newsletter",
      checkboxes: [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
      ],
    },
  ];
  const form1: Form = {
    name: 'test1',
    description: 'testtt',
    id: 'test1',
    topic: "test1",
    fields: formFields,
  }
  const form2: Form = {
    name: 'test2',
    description: 'testtt222',
    id: 'test2',
    topic: "test2",
    fields: formFields,
  }
  const form3: Form = {
    name: 'test3',
    description: 'testtttttttt',
    id: 'test3',
    topic: "test3",
    fields: formFields,
  }
  const forms = [form1, form2, form3];
  const createData = api.entry.create.useMutation();
  const handleSubmit = (data: FormsData) => {
    console.log(data)
    // createData.mutate(data)
  }
  return (
      <div className="min-h-screen bg-gray-100 py-10 px-5 flex items-center justify-center">
        <div className="container flex flex-col gap-4">
          <RandomQuestion text="Hiii"></RandomQuestion>
          <FormMapper forms={forms} onSubmit={handleSubmit} />
        </div>

      </div>
  );
};

