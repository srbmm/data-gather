import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Define the directory where files will be stored
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadRouter = createTRPCRouter({
    uploadFile: publicProcedure
        .input((val: { file: Express.Multer.File }) => val) // Define input type
        .mutation(async ({ input }) => {
            const { file } = input;

            if (!file) {
                throw new Error("No file uploaded");
            }

            // Generate a unique filename for the uploaded file
            const uniqueFileName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadDir, uniqueFileName);

            try {
                // Use fs.writeFileSync to save the file content directly to the disk
                fs.writeFileSync(filePath, file.buffer); // file.buffer contains the raw binary data of the file

                return {
                    originalName: file.originalname,
                    uuidFileName: uniqueFileName,
                    fileSize: file.size,
                    fileType: file.mimetype,
                    filePath, // Returning file path as part of the response
                };
            } catch (error) {
                throw new Error("Error writing file to disk: " + error.message);
            }
        }),
});
