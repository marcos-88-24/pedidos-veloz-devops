const express = require('express');
const pool = require('./db');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/pedidos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM pedidos');
    res.json(rows);
});

app.post('/pedidos', async (req, res) => {
    const { produto, status } = req.body;
    await pool.query('INSERT INTO pedidos (produto, status) VALUES (?, ?)', [produto, status]);
    res.json({ message: 'Pedido criado com sucesso!', pedido: { produto, status } });
});

app.listen(port, () => {
    console.log(`Pedidos rodando em http://localhost:${port}`);
});
