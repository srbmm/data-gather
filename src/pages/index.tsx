import FormMapper from "~/components/form/FormMapper";
import { FormsData } from "~/types";
import { RandomQuestion } from "~/components/other/RandomQuestion";
import { api } from "~/utils/api";
import { Alert } from "flowbite-react";

export default function MultiFormPage() {

  const formRes = api.form.getAll.useQuery();


  const createEntry = api.entry.create.useMutation();
  const {data: randomWord} = api.stringList.chooseRandom.useQuery();
  console.log(randomWord);
  const handleSubmit = async (data: FormsData) => {
    try {
      console.log(data);
      await createEntry.mutateAsync({
        formData: data,
      });
      console.log("Entry created successfully:", data);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-5 py-10">
      <div className="container flex flex-col gap-4">
        {randomWord && <RandomQuestion text={randomWord} />}
        {formRes.data ? (
          <FormMapper forms={formRes.data} onSubmit={handleSubmit} />
        ) : (
          <Alert color="red">There is no Form.</Alert>
        )}
      </div>
    </div>
  );
}
