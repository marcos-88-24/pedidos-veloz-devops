const express = require('express');
const pool = require('./db'); 
const app = express();
const port = 3002;

app.use(express.json());

// principal
app.get('/', (req, res) => {
    res.send('Pagamentos rodando!');
});

// health check
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

// listar pagamentos
app.get('/pagamentos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pagamentos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar pagamentos' });
    }
});

// registrar pagamento
app.post('/pagamentos', async (req, res) => {
    try {
        const { pedido_id, valor, metodo } = req.body;

        if (!pedido_id || !valor || !metodo) {
            return res.status(400).json({ error: 'Pedido, valor e método são obrigatórios' });
        }

        const [result] = await pool.query(
            'INSERT INTO pagamentos (pedido_id, valor, metodo) VALUES (?, ?, ?)',
            [pedido_id, valor, metodo]
        );

        const [rows] = await pool.query('SELECT * FROM pagamentos WHERE id = ?', [result.insertId]);

        res.json({ 
            message: 'Pagamento registrado com sucesso!', 
            pagamento: rows[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar pagamento' });
    }
});

app.listen(port, () => {
    console.log(`Pagamentos rodando em http://localhost:${port}`);
});
