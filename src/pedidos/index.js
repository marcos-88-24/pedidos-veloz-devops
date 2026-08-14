const express = require('express');
const pool = require('./db'); 
const app = express();
const port = 3001;

app.use(express.json());

// principal
app.get('/', (req, res) => {
    res.send('Pedidos rodando!');
});

// health check
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

// listar pedidos
app.get('/pedidos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pedidos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
});

// adicionar pedido
app.post('/pedidos', async (req, res) => {
    try {
        const { cliente, produto, quantidade } = req.body;

        if (!cliente || !produto || !quantidade) {
            return res.status(400).json({ error: 'Cliente, produto e quantidade são obrigatórios' });
        }

        const [result] = await pool.query(
            'INSERT INTO pedidos (cliente, produto, quantidade) VALUES (?, ?, ?)',
            [cliente, produto, quantidade]
        );

        const [rows] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [result.insertId]);

        res.json({ 
            message: 'Pedido criado com sucesso!', 
            pedido: rows[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});

app.listen(port, () => {
    console.log(`Pedidos rodando em http://localhost:${port}`);
});
