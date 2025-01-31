import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Label, Textarea } from 'flowbite-react';
import type {RandomData} from "~/types";



const RandomData = () => {
    const { register, handleSubmit, control, setValue, watch } = useForm<RandomData>({
        defaultValues: {
            enabled: false,
            items: '', // Store items as a plain string initially
        },
    });

    const enabled = watch('enabled');

    const onSubmit = (data: RandomData) => {
        // When submitting, try to parse the JSON string into an array
        try {
            const parsedItems = JSON.parse(data.items);
            if (Array.isArray(parsedItems)) {
                console.log(data); // Log the parsed JSON (array) to the console
            } else {
                alert('Please enter a valid JSON array.');
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
                <div className="mb-4 flex items-center gap-2">
                    <Controller
                        name="enabled"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Checkbox {...field} id="enable" />
                                <Label htmlFor="enable">Enable List Input</Label>
                            </>
                        )}
                    />
                </div>

                {/* If enabled, show the Textarea for JSON input */}
                {enabled && (
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
                )}

                <Button type="submit" className="mt-4">Save</Button>
            </form>
        </div>
    );
};

export default RandomData;
