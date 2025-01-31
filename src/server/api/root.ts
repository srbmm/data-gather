import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { formRouter, entryRouter} from "./routers/route";
import { uploadRouter } from "./routers/uploadRouter";
import { stringListRouter } from "./routers/stringListRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  form: formRouter,
  entry: entryRouter,
  upload: uploadRouter,
  stringList: stringListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
