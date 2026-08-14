const express = require('express');
const pool = require('./db'); 
const app = express();
const port = 3003;

app.use(express.json());

// principal
app.get('/', (req, res) => {
    res.send('Estoque rodando!');
});

// health check
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

// listar itens do estoque
app.get('/estoque', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM estoque');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar estoque' });
    }
});

// adicionar item ao estoque
app.post('/estoque', async (req, res) => {
    try {
        const { produto, quantidade } = req.body;

        if (!produto || !quantidade) {
            return res.status(400).json({ error: 'Produto e quantidade são obrigatórios' });
        }

        const [result] = await pool.query(
            'INSERT INTO estoque (produto, quantidade) VALUES (?, ?)',
            [produto, quantidade]
        );

        const [rows] = await pool.query('SELECT * FROM estoque WHERE id = ?', [result.insertId]);

        res.json({ 
            message: 'Item adicionado ao estoque!', 
            item: rows[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar item ao estoque' });
    }
});

app.listen(port, () => {
    console.log(`Estoque rodando em http://localhost:${port}`);
});
