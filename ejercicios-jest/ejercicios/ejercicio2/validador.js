function validarContrasena(contrasena) {
    const errores = [];
    
    if (contrasena.length < 8) {
        errores.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(contrasena)) {
        errores.push('La contraseña debe contener al menos una mayúscula');
    }
    
    if (!/[0-9]/.test(contrasena)) {
        errores.push('La contraseña debe contener al menos un número');
    }
    
    return {
        valida: errores.length === 0,
        errores: errores
    };
}

module.exports = validarContrasena;