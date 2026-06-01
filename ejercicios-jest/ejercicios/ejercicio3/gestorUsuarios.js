class GestorUsuarios {
    constructor() {
        this.usuarios = [];
        this.contadorId = 1;
    }
    
    agregarUsuario(nombre, email) {
        if (!nombre || !email) {
            throw new Error('Nombre y email son obligatorios');
        }
        
        const nuevoUsuario = {
            id: this.contadorId++,
            nombre: nombre,
            email: email
        };
        
        this.usuarios.push(nuevoUsuario);
        return nuevoUsuario;
    }
    
    buscarUsuario(id) {
        const usuario = this.usuarios.find(u => u.id === id);
        if (!usuario) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }
    
    eliminarUsuario(id) {
        const index = this.usuarios.findIndex(u => u.id === id);
        if (index === -1) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }
        
        const usuarioEliminado = this.usuarios[index];
        this.usuarios.splice(index, 1);
        return usuarioEliminado;
    }
    
    obtenerTodos() {
        return [...this.usuarios];
    }
}

module.exports = GestorUsuarios;