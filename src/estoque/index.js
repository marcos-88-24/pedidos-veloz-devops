const express = require('express');
const pool = require('./db'); 
const app = express();
const port = 3003;

app.use(express.json());

// rota principal
app.get('/', (req, res) => {
    res.send('Estoque rodando!');
});

// rota de health check
app.get('/health', (req, res) => {
    res.sendStatus(200); // retorna apenas 200 OK
});

// listar itens do estoque
app.get('/estoque', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM estoque');
    res.json(rows);
});

// adicionar item ao estoque
app.post('/estoque', async (req, res) => {
    const { produto, quantidade } = req.body;
    await pool.query('INSERT INTO estoque (produto, quantidade) VALUES (?, ?)', [produto, quantidade]);
    res.json({ message: 'Item adicionado ao estoque!', item: { produto, quantidade } });
});

app.listen(port, () => {
    console.log(`Estoque rodando em http://localhost:${port}`);
});