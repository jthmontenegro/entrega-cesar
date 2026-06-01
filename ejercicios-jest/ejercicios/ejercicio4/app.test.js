const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { app, Producto } = require('./app');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
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
        nombre: 'Laptop',
        precio: 1500,
        categoria: 'Electronica',
        stock: 10
    };
    
    describe('POST /productos', () => {
        test('debe crear un nuevo producto', async () => {
            const res = await request(app)
                .post('/productos')
                .send(productoEjemplo);
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.nombre).toBe('Laptop');
            expect(res.body.precio).toBe(1500);
        });
        
        test('debe retornar 400 si faltan campos requeridos', async () => {
            const res = await request(app)
                .post('/productos')
                .send({ nombre: 'Solo nombre' });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toContain('faltan campos requeridos');
        });
    });
    
    describe('GET /productos', () => {
        test('debe retornar lista vacia cuando no hay productos', async () => {
            const res = await request(app).get('/productos');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });
        
        test('debe retornar todos los productos guardados', async () => {
            await Producto.create(productoEjemplo);
            await Producto.create({
                nombre: 'Mouse',
                precio: 25,
                categoria: 'Perifericos',
                stock: 50
            });
            
            const res = await request(app).get('/productos');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });
    
    describe('GET /productos/:id', () => {
        test('debe retornar un producto por su ID', async () => {
            const producto = await Producto.create(productoEjemplo);
            
            const res = await request(app).get(`/productos/${producto._id}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.nombre).toBe('Laptop');
        });
        
        test('debe retornar 404 si el producto no existe', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/productos/${idInexistente}`);
            
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Producto no encontrado');
        });
    });
    
    describe('PUT /productos/:id', () => {
        test('debe actualizar un producto existente', async () => {
            const producto = await Producto.create(productoEjemplo);
            
            const res = await request(app)
                .put(`/productos/${producto._id}`)
                .send({ nombre: 'Laptop Gamer', precio: 1800 });
            
            expect(res.statusCode).toBe(200);
            expect(res.body.nombre).toBe('Laptop Gamer');
            expect(res.body.precio).toBe(1800);
        });
        
        test('debe retornar 404 al actualizar producto inexistente', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/productos/${idInexistente}`)
                .send({ nombre: 'Nuevo nombre' });
            
            expect(res.statusCode).toBe(404);
        });
    });
    
    describe('DELETE /productos/:id', () => {
        test('debe eliminar un producto existente', async () => {
            const producto = await Producto.create(productoEjemplo);
            
            const res = await request(app).delete(`/productos/${producto._id}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.mensaje).toBe('Producto eliminado correctamente');
            
            const productoEliminado = await Producto.findById(producto._id);
            expect(productoEliminado).toBeNull();
        });
        
        test('debe retornar 404 al eliminar producto inexistente', async () => {
            const idInexistente = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/productos/${idInexistente}`);
            
            expect(res.statusCode).toBe(404);
        });
    });
});