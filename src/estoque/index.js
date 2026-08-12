const express = require('express');
const pool = require('./db'); 
const app = express();
const port = 3003;

app.use(express.json());

app.get('/estoque', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM estoque');
    res.json(rows);
});

app.post('/estoque', async (req, res) => {
    const { produto, quantidade } = req.body;
    await pool.query('INSERT INTO estoque (produto, quantidade) VALUES (?, ?)', [produto, quantidade]);
    res.json({ message: 'Item adicionado ao estoque!', item: { produto, quantidade } });
});

app.listen(port, () => {
    console.log(`Estoque rodando em http://localhost:${port}`);
});
