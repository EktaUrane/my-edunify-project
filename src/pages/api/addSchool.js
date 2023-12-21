import nextConnect from 'next-connect';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const handler = nextConnect()
    .post(async (req, res) => {
        const form = new formidable.IncomingForm();
        form.uploadDir = "./public/schoolImages";
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(500).json({ error: "Error parsing the form data." });
                return;
            }

            // Handling Form fields
            const { name, address, city, state, contact_number, email_id } = fields;
            const imagePath = files.image ? path.basename(files.image.filepath) : '';

            // Making Connection to MySQL Server
            const connection = await mysql.createConnection({
                host: '<localhost>',
                user: '<Username>',
                password: '<Password>',
                database: 'edunify-project'
            });

            try {
                // Loading data to MySQL Server
                const query = 'INSERT INTO schools (name, address, city, state, contact_number, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
                await connection.execute(query, [name, address, city, state, contact_number, email_id, imagePath]);

                res.status(200).json({ message: "School added successfully." });
            } catch (dbError) {
                res.status(500).json({ error: "Database operation failed." });
            } finally {
                connection.end();
            }
        });
    });

export const config = {
    api: {
        bodyParser: false
    }
};

export default handler;
