import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const connection = await mysql.createConnection({
            host: '<localhost>',
            user: '<Username>',
            password: '<Password>',
            database: 'edunify-project'
        });

        const [rows] = await connection.execute('SELECT name, address, city, image FROM schools LIMIT ? OFFSET ?', [limit, offset]);

        const [totalResults] = await connection.execute('SELECT COUNT(*) as total FROM schools');
        const total = totalResults[0].total;

        connection.end();

        res.status(200).json({ data: rows, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schools', error: error.message });
    }
}
