function celsiusAFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function fahrenheitACelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

module.exports = { celsiusAFahrenheit, fahrenheitACelsius };