import {Card, Tabs} from "flowbite-react";
import { FaWpforms, FaRandom } from "react-icons/fa";
import FormManager from "~/components/admin/ManageForms";
import RandomData from "~/components/admin/RandomData";

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 flex items-center justify-center">
      <Card className="container p-10 min-h-96">
        <Tabs aria-label="Default tabs" variant="default">
          <Tabs.Item active title="Form Setting" icon={FaWpforms}>
              <FormManager />
          </Tabs.Item>
          <Tabs.Item title="Random Data" icon={FaRandom}>
              <RandomData />
          </Tabs.Item>

        </Tabs>
      </Card>
    </div>
  );
}
