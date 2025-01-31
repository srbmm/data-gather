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
            required: false,
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

export const Form = 
  mongoose.models.Form 
    ? mongoose.models.Form as Model<FormDocument>
    : mongoose.model<FormDocument>("Form", FormSchema);


//////

interface FormData {
  [key: string]: {
    [key: string]: unknown;
  };
}

interface EntryDocument extends Document {
  id: String;
  formData: FormData;
  // we can also get user's data as well (ipAddress, browser, ...)
}

const EntrySchema = new Schema<EntryDocument>(
{
  id: { type: String, required: true },
  formData: {
    type: Map,
    of: new Schema({
      type: Map,
      of: Schema.Types.Mixed
    }, { _id: false })
  },
},
  { timestamps: true },
);

EntrySchema.pre('save', function(next) {
  if (!this.formData || Object.keys(this.formData).length === 0) {
    const err = new Error('Empty data');
    return next(err);
  }
  next();
});

export const Entry = 
  mongoose.models.Entry 
  ? mongoose.models.Entry as Model<EntryDocument>
  : mongoose.model<EntryDocument>("Entry", EntrySchema);
