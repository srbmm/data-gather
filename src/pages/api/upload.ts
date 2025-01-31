import fs from 'fs';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

// Disable Next.js body parser for this route
export const config = {
    api: {
        bodyParser: false, // Disable body parser
    },
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method === 'POST') {
        const chunks: Buffer[] = [];

        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const boundary = getBoundary(req.headers['content-type'] || '');

            if (boundary) {
                const [fileData] = parseMultipartFormData(buffer, boundary);
                const filePath = path.join(process.cwd(), 'uploads', fileData.filename);

                // Create 'uploads' directory if it doesn't exist
                if (!fs.existsSync('uploads')) {
                    fs.mkdirSync('uploads');
                }

                // Write file to disk
                fs.writeFile(filePath, fileData.content, (err) => {
                    if (err) {
                        res.status(500).json({ error: 'File upload failed' });
                        return;
                    }

                    res.status(200).json({
                        message: 'File uploaded successfully!',
                        file: {
                            originalName: fileData.filename,
                            filePath,
                            size: fileData.content.length,
                        },
                    });
                });
            } else {
                res.status(400).json({ error: 'Invalid request format' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

// Helper function to get the boundary from the Content-Type header
function getBoundary(contentType: string): string | null {
    const match = contentType.match(/boundary=([^\s;]+)/);
    return match ? match[1] : null;
}

// Simple function to parse multipart form data manually
function parseMultipartFormData(buffer: Buffer, boundary: string) {
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    const parts: any[] = [];

    // Split the incoming buffer into sections by the boundary
    const sections = buffer.split(boundaryBuffer);
    for (let section of sections) {
        if (section.length === 0) continue;

        // Find the content disposition header and extract filename and content
        const contentDispositionMatch = section.toString().match(/Content-Disposition: form-data; name="file"; filename="([^"]+)"/);
        if (contentDispositionMatch) {
            const filename = contentDispositionMatch[1];
            const contentStartIndex = section.indexOf('\r\n\r\n') + 4;
            const content = section.slice(contentStartIndex);

            parts.push({
                filename,
                content,
            });
        }
    }

    return parts;
}
