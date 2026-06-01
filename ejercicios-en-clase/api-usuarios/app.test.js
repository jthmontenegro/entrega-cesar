const request = require('supertest');
const app = require('./app');

describe('Pruebas de la API de usuarios', () => {

    test('GET /usuarios debe retornar todos los usuarios', async () => {
        const res = await request(app).get('/usuarios');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /usuarios/1 debe retornar el usuario con id 1', async () => {
        const res = await request(app).get('/usuarios/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.nombre).toBe('Ana');
    });

    test('GET /usuarios/99 debe retornar 404 si no existe', async () => {
        const res = await request(app).get('/usuarios/99');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('usuario no encontrado');
    });

    test('POST /usuarios debe agregar un nuevo usuario', async () => {
        const res = await request(app)
            .post('/usuarios')
            .send({ nombre: 'Carlos' });
        expect(res.statusCode).toBe(201);
        expect(res.body.nombre).toBe('Carlos');
    });
});