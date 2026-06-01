const express = require('express');
const app = express();
app.use(express.json());

let usuarios = [
    { id: 1, nombre: 'Ana' },
    { id: 2, nombre: 'Luis' }
];

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

app.get('/usuarios/:id', (req, res) => {
    const user = usuarios.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'usuario no encontrado' });
    }
});

app.post('/usuarios', (req, res) => {
    const nuevo = {
        id: usuarios.length + 1,
        nombre: req.body.nombre
    };
    usuarios.push(nuevo);
    res.status(201).json(nuevo);
});

module.exports = app;