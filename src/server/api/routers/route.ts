import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Entry, Form } from "~/db/schema";


const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const formFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["text", "textarea", "select", "file", "checkbox"]),
  label: z.string().optional(),
  options: z.array(optionSchema).optional(),
  required: z.boolean().optional(),
  validation: z.object({
    regex: z.string().optional(),
    maxSize: z.number().optional(),
    fileType: z.array(z.string()).optional(),
  }).optional(),
  checkboxes: z.array(optionSchema).optional(),
});

const createFormSchema = z.object({
  topic: z.string(),
  description: z.string(),
  fields: z.array(formFieldSchema),
  name: z.string(),
});


export const formRouter = createTRPCRouter({
  create: publicProcedure
    .input(createFormSchema)
    .mutation(async({ input }) => {
      const newForm = new Form({
        id: crypto.randomUUID(),
        ...input,
      });
      return await newForm.save();
    }),

  createMany: publicProcedure
    .input(z.array(createFormSchema))
    .mutation(async ({ input }) => {
      const formsToSave = input.map(formData => ({
        id: crypto.randomUUID(),
        ...formData
      }));
      return await Form.insertMany(formsToSave);
    }),

  getOne: publicProcedure
    .input(z.string())
    .query( async ({ input }) => {
      const form = await Form.findOne({ id: input });
      if (!form) throw new Error('from not found');
      return form;
    }),

  getAll: publicProcedure
    .query( async () => {
      const form = await Form.find().sort();
      if (!form) throw new Error('from not found');
      return form;
    }),
});


const formDataSchema = z.record(
  z.string(),
  z.record(z.string(), z.unknown())
);

const createEntrySchema = z.object({
  formData: formDataSchema,
});

export const entryRouter = createTRPCRouter({
  create: publicProcedure
    .input(createEntrySchema)
    .mutation(async ({ input }) => {
      const newEntry = new Entry({
        id: crypto.randomUUID(),
        ...input,
      });
      return await newEntry.save();
  }),
  
})
