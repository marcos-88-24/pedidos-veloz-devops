const express = require('express');
const pool = require('./db');
const app = express();
const port = 3001;

app.use(express.json());

// rota principal
app.get('/', (req, res) => {
    res.send('Pedidos rodando!');
});

// rota de health check
app.get('/health', (req, res) => {
    res.sendStatus(200); // retorna apenas 200 OK
});

// listar pedidos
app.get('/pedidos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM pedidos');
    res.json(rows);
});

// criar pedido
app.post('/pedidos', async (req, res) => {
    const { produto, status } = req.body;
    await pool.query('INSERT INTO pedidos (produto, status) VALUES (?, ?)', [produto, status]);
    res.json({ message: 'Pedido criado com sucesso!', pedido: { produto, status } });
});

app.listen(port, () => {
    console.log(`Pedidos rodando em http://localhost:${port}`);
});
