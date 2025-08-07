
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./horas.db', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado ao banco de dados SQLite.');
});

// Criação da tabela
db.run(`CREATE TABLE IF NOT EXISTS horas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    funcionario TEXT,
    turno TEXT,
    data TEXT,
    horas_feitas INTEGER,
    horas_gastas INTEGER,
    justificativa TEXT
)`);

// Rotas
app.get('/api/horas', (req, res) => {
    db.all("SELECT * FROM horas", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.post('/api/horas', (req, res) => {
    const { funcionario, turno, data, horas_feitas, horas_gastas, justificativa } = req.body;
    db.run(`INSERT INTO horas (funcionario, turno, data, horas_feitas, horas_gastas, justificativa) VALUES (?, ?, ?, ?, ?, ?)`,
        [funcionario, turno, data, horas_feitas, horas_gastas, justificativa],
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
