import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

const uploadDir = path.join(process.cwd(), "/uploads");

// Ensure the uploads directory exists
fs.mkdir(uploadDir, { recursive: true });

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error processing upload." });
      }

      // Example: Return mock results after "processing"
      const results = [
        { name: "Field1", value: "Value1" },
        { name: "Field2", value: "Value2" },
      ];

      return res.status(200).json({ data: results });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
