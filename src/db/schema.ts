import mongoose, { Model, Document } from "mongoose"
const { Schema } = mongoose;
import { Form as F, FormField, OptionType } from "~/types";


export interface FormDocument extends Omit<F, 'id'>, Document {}

const OptionSchema = new Schema<OptionType>(
    {
        label: { type: String, required: true },
        value: { type: String, required: true },
    },
    { _id: false }
);

const FormFieldSchema = new Schema<FormField>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["text", "textarea", "select", "file", "checkbox"],
            required: true,
        },
        label: { type: String, required: false },
        options: { type: [OptionSchema], required: false }, // array
        required: { type: Boolean, required: false },
        validation: {
            regex: String,
            maxSize: Number,
            fileType: [String],
        },
        checkboxes: [OptionSchema],
    },
    { _id: false },
);

const FormSchema = new Schema<FormDocument>(
    {
        id: { type: String, required: true },
        topic: { type: String, required: true },
        description: { type: String, required: true },
        fields: [FormFieldSchema], // array of fields
        name: { type: String, required: true },
    },
    { strict: false, timestamps: true },
);

// export const Form = mongoose.models.Form || mongoose.model<FormDocument>("Form", FormSchema);
export const Form = 
  mongoose.models.Form 
    ? mongoose.models.Form as Model<FormDocument>
    : mongoose.model<FormDocument>("Form", FormSchema);
