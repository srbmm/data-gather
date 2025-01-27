import {CustomTextInput} from "~/components/inputs";
import {DynamicForm} from "~/components/form/DynamicForm";
import {useState} from "react";

export default function  MultiFormPage () {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFormChange = (data: Record<string, any>) => {
    setFormData(data);
  };

  const formFields = [
    {
      name: "firstName",
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
      type: "text",
      label: "Last Name",
      required: true,
    },
    {
      name: "bio",
      type: "textarea",
      label: "Bio",
      required: false,
    },
    {
      name: "favoriteColor",
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
      type: "file",
      label: "Profile Picture",
      validation: {
        maxSize: 5 * 1024 * 1024, // 5MB
        fileType: ["image/jpeg", "image/png"],
      },
    },
    {
      name: "newsletter",
      type: "checkbox",
      label: "Subscribe to newsletter",
      checkboxes: [
        { id: "daily", label: "Daily" },
        { id: "weekly", label: "Weekly" },
      ],
    },
  ];
  return (
      <div className="min-h-screen bg-gray-100 py-10 px-5">
        <div className="container">
          <h1>Dynamic Form</h1>
          <DynamicForm fields={formFields} onChange={handleFormChange} />
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-10">Multi-Form Page</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Form 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Form 1</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <CustomTextInput label={"Hiii"} errorText={'hi'}/>
                  {/*<DynamicForm />*/}
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </div>

            {/* Form 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Form 2</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="field2" className="mb-2 font-medium">
                    Field 2
                  </label>
                  <input
                      id="field2"
                      type="text"
                      className="p-2 border rounded-lg focus:outline-blue-500"
                      placeholder="Enter value..."
                  />
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </div>

            {/* Form 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Form 3</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="field3" className="mb-2 font-medium">
                    Field 3
                  </label>
                  <input
                      id="field3"
                      type="text"
                      className="p-2 border rounded-lg focus:outline-blue-500"
                      placeholder="Enter value..."
                  />
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

