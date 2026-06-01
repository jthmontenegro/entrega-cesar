const { celsiusAFahrenheit, fahrenheitACelsius } = require('./temperatura');

test('Convertir 0°C a Fahrenheit debe dar 32°F', () => {
    expect(celsiusAFahrenheit(0)).toBe(32);
});

test('Convertir 100°C a Fahrenheit debe dar 212°F', () => {
    expect(celsiusAFahrenheit(100)).toBe(212);
});

test('Convertir 32°F a Celsius debe dar 0°C', () => {
    expect(fahrenheitACelsius(32)).toBe(0);
});

test('Convertir 212°F a Celsius debe dar 100°C', () => {
    expect(fahrenheitACelsius(212)).toBe(100);
});