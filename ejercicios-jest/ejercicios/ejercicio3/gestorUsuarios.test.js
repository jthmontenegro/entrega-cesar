const GestorUsuarios = require('./gestorUsuarios');

describe('Gestor de Usuarios', () => {
    let gestor;
    
    beforeEach(() => {
        gestor = new GestorUsuarios();
    });
    
    test('debe agregar un nuevo usuario', () => {
        const usuario = gestor.agregarUsuario('Carlos', 'carlos@email.com');
        expect(usuario).toHaveProperty('id');
        expect(usuario.nombre).toBe('Carlos');
        expect(gestor.obtenerTodos().length).toBe(1);
    });
    
    test('debe buscar un usuario por ID', () => {
        const usuarioCreado = gestor.agregarUsuario('Ana', 'ana@email.com');
        const encontrado = gestor.buscarUsuario(usuarioCreado.id);
        expect(encontrado).toEqual(usuarioCreado);
    });
    
    test('debe lanzar error al buscar ID inexistente', () => {
        expect(() => gestor.buscarUsuario(999)).toThrow('Usuario con ID 999 no encontrado');
    });
    
    test('debe eliminar un usuario', () => {
        const usuario = gestor.agregarUsuario('Luis', 'luis@email.com');
        expect(gestor.obtenerTodos().length).toBe(1);
        
        const eliminado = gestor.eliminarUsuario(usuario.id);
        expect(eliminado).toEqual(usuario);
        expect(gestor.obtenerTodos().length).toBe(0);
    });
    
    test('debe lanzar error al eliminar ID inexistente', () => {
        expect(() => gestor.eliminarUsuario(999)).toThrow('Usuario con ID 999 no encontrado');
    });
});
