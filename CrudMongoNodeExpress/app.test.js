import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from './app.js';
import Producto from './models/producto.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Desconectar cualquier conexión existente
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    
    await mongoose.connect(uri);
});

beforeEach(async () => {
    await Producto.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Pruebas de API de Productos (CRUD completo)', () => {
    
    const productoEjemplo = {
        codigo: 1001,
        nombre: 'Camisa',
        precio: 25000,
        categoria: 'Ropa'
    };
    
    describe('POST /api/productos', () => {
        test('debe crear un nuevo producto', async () => {
            const res = await request(app)
                .post('/api/productos')
                .send(productoEjemplo);
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.codigo).toBe(1001);
            expect(res.body.nombre).toBe('Camisa');
        });
        
        test('debe retornar 400 si falta el codigo', async () => {
            const res = await request(app)
                .post('/api/productos')
                .send({ nombre: 'Camisa', precio: 25000, categoria: 'Ropa' });
            
            expect(res.statusCode).toBe(400);
        });
        
        test('debe retornar 400 si la categoria no es valida', async () => {
            const res = await request(app)
                .post('/api/productos')
                .send({ codigo: 1002, nombre: 'Camisa', precio: 25000, categoria: 'Invalida' });
            
            expect(res.statusCode).toBe(400);
        });
    });
    
    describe('GET /api/productos', () => {
        test('debe retornar lista vacia cuando no hay productos', async () => {
            const res = await request(app).get('/api/productos');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });
        
        test('debe retornar todos los productos guardados', async () => {
            await Producto.create(productoEjemplo);
            await Producto.create({ codigo: 1002, nombre: 'Zapatos', precio: 80000, categoria: 'Calzado' });
            
            const res = await request(app).get('/api/productos');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
    
    describe('GET /api/productos/:id', () => {
        test('debe retornar un producto por su ID', async () => {
            const producto = await Producto.create(productoEjemplo);
            
            const res = await request(app).get(`/api/productos/${producto._id}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.nombre).toBe('Camisa');
        });
        
        test('debe retornar 404 si el producto no existe', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/productos/${idInexistente}`);
            
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Producto no encontrado');
        });
    });
    
    describe('PUT /api/productos/:id', () => {
        test('debe actualizar un producto existente', async () => {
            const producto = await Producto.create(productoEjemplo);
            
            const res = await request(app)
                .put(`/api/productos/${producto._id}`)
                .send({ nombre: 'Camisa Azul', precio: 30000 });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.producto.nombre).toBe('Camisa Azul');
            expect(res.body.producto.precio).toBe(30000);
        });
        
        test('debe retornar 404 al actualizar producto inexistente', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/api/productos/${idInexistente}`)
                .send({ nombre: 'Nuevo nombre' });
            
            expect(res.statusCode).toBe(404);
        });
    });
    
    describe('DELETE /api/productos/:id', () => {
        test('debe eliminar un producto existente', async () => {
            const producto = await Producto.create(productoEjemplo);
            
            const res = await request(app).delete(`/api/productos/${producto._id}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.mensaje).toBe('Producto eliminado');
            
            const productoEliminado = await Producto.findById(producto._id);
            expect(productoEliminado).toBeNull();
        });
        
        test('debe retornar 404 al eliminar producto inexistente', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/api/productos/${idInexistente}`);
            
            expect(res.statusCode).toBe(404);
        });
    });
});