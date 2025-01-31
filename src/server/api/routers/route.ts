import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {Entry, Form} from "~/db/schema";


const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

const formFieldSchema = z.object({
    name: z.string(),
    type: z.enum(["text", "textarea", "select", "file", "checkbox"]),
    label: z.string().optional(),
    options: z.array(optionSchema).optional(),
    required: z.boolean().optional(),
    validation: z
        .object({
            regex: z.string().optional(),
            maxSize: z.number().optional(),
            fileType: z.string().optional(),
        })
        .optional(),
    checkboxes: z.array(optionSchema).optional(),
});

const updateFormsSchema = z.array(
    z.object({
        topic: z.string(),
        description: z.string(),
        fields: z.array(formFieldSchema),
        name: z.string(),
    })
);

export const formRouter = createTRPCRouter({
    getAll: publicProcedure.query(async () => {
        return await Form.find(); // Returns an empty array if no forms exist
    }),

    updateAll: publicProcedure
        .input(updateFormsSchema)
        .mutation(async ({ input }) => {
            // First, remove all forms
            await Form.deleteMany({});

            // Then insert all the new forms
            await Form.insertMany(input);

            return { success: true };
        }),
});

// Define schema for file uploads
const fileUploadSchema = z.object({
    fieldName: z.string(),
    filePath: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
});

// Define schema for form data
const formDataSchema = z.record(
    z.string(),
    z.record(z.string(), z.unknown())
);

// Define schema for creating an entry
const createEntrySchema = z.object({
    formData: formDataSchema,
    fileUploads: z.array(fileUploadSchema).optional(),
});

// Entry API Routes
export const entryRouter = createTRPCRouter({
    create: publicProcedure
        .input(createEntrySchema)
        .mutation(async ({ input }) => {
            const newEntry = new Entry({
                ...input,
            });
            return await newEntry.save();
        }),
    // getAll: publicProcedure
    //     .query(async ({ input }) => {
    //         const newEntry = new Entry({
    //             ...input,
    //         });
    //         return await newEntry.save();
    //     }),
});


