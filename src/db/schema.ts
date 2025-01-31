import mongoose, { Model, Document, Schema } from "mongoose";
import { Form as F, FormField, OptionType } from "~/types";

// Define interfaces
export interface FormDocument extends Omit<F, "id">, Document {}

interface FormData {
  [key: string]: {
    [key: string]: unknown;
  };
}

interface EntryDocument extends Document {
  id: string;
  formData: FormData;
  // Additional fields like user's data (ipAddress, browser, ...) can be added here
}

// Define schemas
const OptionSchema = new Schema<OptionType>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const FormFieldSchema = new Schema<FormField>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "textarea", "select", "file", "checkbox"],
      required: true,
    },
    label: { type: String, required: true },
    options: { type: [OptionSchema], required: false }, // array
    required: { type: Boolean, required: false },
    validation: {
      regex: String,
      maxSize: { type: Number, required: false },
      fileType: String,
    },
    checkboxes: { type: [OptionSchema], required: false },
  },
  { _id: true },
);

const FormSchema = new Schema<FormDocument>(
  {
    topic: { type: String, required: true },
    description: { type: String, required: true },
    fields: { type: [FormFieldSchema], required: true }, // array of fields
    name: { type: String, required: true },
  },
  { strict: false, timestamps: true },
);

interface EntryDocument extends Document {
  formData: Record<string, Record<string, unknown>>;
}

const EntrySchema = new Schema<EntryDocument>(
  {
    formData: {
      type: Map,
      of: {
        type: Map,
        of: Schema.Types.Mixed, // Use Mixed to allow any data type
      },
    },
  },
  { timestamps: true },
);

// Define the schema for the string list
interface StringListDocument extends Document {
    list: string[];
}

const StringListSchema = new Schema<StringListDocument>(
    {
        list: {
            type: [String], // Array of strings
            required: true,
            default: [],
        },
    },
    { timestamps: true }
);

export const StringList = mongoose.models.StringList || mongoose.model<StringListDocument>('StringList', StringListSchema);

export const Entry = mongoose.models.Entry ||  mongoose.model<EntryDocument>("Entry", EntrySchema);

// Export models
export const Form: Model<FormDocument> =
  mongoose.models.Form || mongoose.model<FormDocument>("Form", FormSchema);
