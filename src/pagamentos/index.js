const express = require('express');
const pool = require('./db');
const app = express();
const port = 3002;

app.use(express.json());

// rota principal
app.get('/', (req, res) => {
    res.send('Pagamentos rodando!');
});

// rota de health check
app.get('/health', (req, res) => {
    res.sendStatus(200); // retorna apenas 200 OK
});

// listar pagamentos
app.get('/pagamentos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM pagamentos');
    res.json(rows);
});

// criar pagamento
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
