const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    stock: { type: Number, default: 0 }
});

const Producto = mongoose.model('Producto', productoSchema);

app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/productos', async (req, res) => {
    try {
        const { nombre, precio, categoria, stock } = req.body;
        
        if (!nombre || !precio || !categoria) {
            return res.status(400).json({ error: 'faltan campos requeridos: nombre, precio, categoria' });
        }
        
        const nuevoProducto = new Producto({ nombre, precio, categoria, stock });
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente', producto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { app, Producto };