const fs = require("fs");
const path = require("path");
const { IncomingForm } = require("formidable");

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle multipart/form-data
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ message: "Error parsing form data" });
      }

      // Check if the file key exists
      if (!files.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const uploadedFile = files.file;

      // Define the file path where the file will be saved
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, uploadedFile.originalFilename);

      // Ensure the uploads directory exists
      fs.mkdirSync(uploadDir, { recursive: true });

      // Move the file to the uploads directory
      fs.renameSync(uploadedFile.filepath, filePath);

      res
        .status(200)
        .json({ message: "File uploaded successfully!", filePath });
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
