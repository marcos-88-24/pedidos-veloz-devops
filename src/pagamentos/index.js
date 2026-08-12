const express = require('express');
const pool = require('./db');
const app = express();
const port = 3002;

app.use(express.json());

app.get('/pagamentos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM pagamentos');
    res.json(rows);
});

app.post('/pagamentos', async (req, res) => {
    const { pedido_id, valor, metodo, status } = req.body;
    await pool.query(
        'INSERT INTO pagamentos (pedido_id, valor, metodo, status) VALUES (?, ?, ?, ?)',
        [pedido_id, valor, metodo, status]
    );
    res.json({ message: 'Pagamento registrado!', pagamento: { pedido_id, valor, metodo, status } });
});

app.listen(port, () => {
    console.log(`Pagamentos rodando em http://localhost:${port}`);
});
