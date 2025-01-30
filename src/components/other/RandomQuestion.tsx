import {Card} from "flowbite-react";
import {RandomQuestionProps} from "~/components/other/types";

export const RandomQuestion: React.FC<RandomQuestionProps> = ({text}) => {

    return <Card className="w-full flex items-center justify-center text-xl">{text}</Card>

}