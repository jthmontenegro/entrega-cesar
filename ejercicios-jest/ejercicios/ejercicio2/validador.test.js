const validarContrasena = require('./validador');

test('Contraseña válida cumple todos los requisitos', () => {
    const resultado = validarContrasena('Password123');
    expect(resultado.valida).toBe(true);
});

test('Contraseña sin mayúsculas debe fallar', () => {
    const resultado = validarContrasena('password123');
    expect(resultado.valida).toBe(false);
    expect(resultado.errores).toContain('La contraseña debe contener al menos una mayúscula');
});

test('Contraseña sin números debe fallar', () => {
    const resultado = validarContrasena('PasswordABC');
    expect(resultado.valida).toBe(false);
    expect(resultado.errores).toContain('La contraseña debe contener al menos un número');
});

test('Contraseña muy corta debe fallar', () => {
    const resultado = validarContrasena('Pas123');
    expect(resultado.valida).toBe(false);
    expect(resultado.errores).toContain('La contraseña debe tener al menos 8 caracteres');
});