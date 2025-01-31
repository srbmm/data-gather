import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Label, Textarea } from 'flowbite-react';
import { api } from "~/utils/api";
import type { RandomData } from "~/types";
import {random} from "nanoid";

const RandomData = () => {
    const { register, handleSubmit, control, setValue, watch } = useForm<RandomData>({
        defaultValues: {
            items: '', // default value for items
        },
    });

    const { data: stringList, isLoading } = api.stringList.getList.useQuery();
    const setListMutation = api.stringList.setList.useMutation();

    // Fetch data and update the form values
    useEffect(() => {
        if (stringList) {
            // Set the enabled state and items from the API
            setValue('enabled', stringList.length > 0);  // Enable if list has items
            setValue('items', JSON.stringify(stringList)); // Convert list to string for the Textarea
        }
    }, [stringList, setValue]);

    const enabled = watch('enabled');  // Watch for the value of "enabled"

    // Reset "items" when "enabled" is unchecked
    useEffect(() => {
        if (!enabled) {
            setValue('items', ''); // Reset items when checkbox is unchecked
        }
    }, [enabled, setValue]);

    // Handle form submit
    const onSubmit = async (data: RandomData) => {
        // When submitting, try to parse the JSON string into an array
        try {
            if(!data.items){
                await setListMutation.mutateAsync({ list: [] });
                return
            }
            const parsedItems = JSON.parse(data.items);
            if (Array.isArray(parsedItems)) {
                await setListMutation.mutateAsync({ list: parsedItems });
            } else {

            }
        } catch (error) {
            alert('Invalid JSON format. Please enter a valid JSON array.');
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Keep the input as a plain string (not parsed as JSON)
        setValue('items', e.target.value);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-center">Random Data</h2>

            <form onSubmit={handleSubmit(onSubmit)}>

                {/* If enabled, show the Textarea for JSON input */}
                    <div>
                        <Label htmlFor="items">Enter List as JSON (Array):</Label>
                        <Textarea
                            {...register('items')}
                            placeholder='e.g. ["item1", "item2", "item3"]'
                            className="mt-2"
                            value={watch('items')} // Use the raw string input from the form state
                            onChange={handleTextChange} // Keep the input as a plain string
                        />
                    </div>



                <Button type="submit" className="mt-4">Save</Button>
            </form>
        </div>
    );
};

export default RandomData;
