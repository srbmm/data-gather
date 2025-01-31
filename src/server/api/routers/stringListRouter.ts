import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { StringList } from "~/db/schema"; // Import the Mongoose model
import { z } from "zod";

// API to set a new list of strings
export const stringListRouter = createTRPCRouter({
    setList: publicProcedure
        .input(z.object({ list: z.array(z.string()) })) // Validate input: array of strings
        .mutation(async ({ input }) => {
            // Upsert the list (create or replace if exists)
            const updatedList = await StringList.findOneAndUpdate(
                {}, // Update the first matching document (assuming there's only one list)
                { list: input.list },
                { upsert: true, new: true } // Create a new document if one doesn't exist
            );
            return updatedList;
        }),

    // API to get the current list of strings
    getList: publicProcedure.query(async () => {
        const stringList = await StringList.findOne({});
        return stringList?.list || [];
    }),

    // API to choose a random string from the list
    chooseRandom: publicProcedure.query(async () => {
        const stringList = await StringList.findOne({});
        if (!stringList || stringList.list.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * stringList.list.length);
        return stringList.list[randomIndex]; // Return the randomly chosen string
    }),
});
