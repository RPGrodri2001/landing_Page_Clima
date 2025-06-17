/*
===============================================
JAVASCRIPT PARA CLIMALATINO - EXPLICADO COMPLETO
===============================================
*/

// ====================================
// 1. BASE DE DATOS DE CIUDADES
// ====================================

/*
¿Qué es esto? Un objeto JavaScript que contiene arrays (listas) de ciudades
¿Para qué sirve? Para llenar dinámicamente el selector de ciudades según el país
¿Cómo funciona? Cuando seleccionas "ecuador", obtienes ['Quito', 'Guayaquil', ...]
*/
const ciudadesPorPais = {
    'argentina': [
        'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 
        'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Neuquén'
    ],
    'bolivia': [
        'La Paz', 'Santa Cruz de la Sierra', 'Cochabamba', 'Sucre', 
        'Oruro', 'Potosí', 'Tarija', 'Beni'
    ],
    'brasil': [
        'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
        'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'
    ],
    'chile': [
        'Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta',
        'Temuco', 'Rancagua', 'Talca', 'Iquique'
    ],
    'colombia': [
        'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
        'Cúcuta', 'Bucaramanga', 'Pereira', 'Manizales'
    ],
    'ecuador': [
        'Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala',
        'Manta', 'Portoviejo', 'Loja', 'Ambato', 'La Troncal', 'Azogues', 'Biblián'
    ],
    'paraguay': [
        'Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque',
        'Capiatá', 'Lambaré', 'Fernando de la Mora'
    ],
    'peru': [
        'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura',
        'Iquitos', 'Cusco', 'Huancayo', 'Chimbote'
    ],
    'uruguay': [
        'Montevideo', 'Salto', 'Paysandú', 'Las Piedras', 'Rivera',
        'Maldonado', 'Tacuarembó', 'Melo'
    ],
    'venezuela': [
        'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay',
        'Ciudad Guayana', 'Barcelona', 'Maturín', 'Cumaná'
    ]
};

// ====================================
// 2. REFERENCIAS AL DOM
// ====================================

/*
¿Qué es el DOM? Document Object Model - la representación de tu HTML en JavaScript
¿Para qué sirve? Para poder modificar, leer y interactuar con elementos HTML
¿Cómo funciona? document.getElementById() busca un elemento por su ID
*/

// Obtenemos referencias a los elementos HTML que vamos a manipular
const paisSelect = document.getElementById('paisSelect');       // El selector de países
const regionSelect = document.getElementById('regionSelect');   // El selector de ciudades
const consultarBtn = document.getElementById('consultarClima'); // El botón de consultar
const resultadoDiv = document.getElementById('resultadoClima'); // La tarjeta de resultados
const loadingDiv = document.getElementById('loading');          // El indicador de carga
const climaDataDiv = document.getElementById('climaData');      // El contenedor de datos

// ====================================
// 3. EVENT LISTENERS (ESCUCHADORES)
// ====================================

/*
¿Qué son los Event Listeners? "Escuchadores" que detectan cuando el usuario hace algo
¿Para qué sirven? Para ejecutar código cuando ocurre un evento (click, cambio, etc.)
¿Cómo funcionan? addEventListener('evento', función_a_ejecutar)
*/

// EVENTO: Cuando cambia el país seleccionado
paisSelect.addEventListener('change', function() {
    /*
    ¿Qué es 'this'? Se refiere al elemento que disparó el evento (paisSelect)
    ¿Qué es 'this.value'? El valor de la opción seleccionada
    */
    const paisSeleccionado = this.value;
    
    console.log('País seleccionado:', paisSeleccionado); // Para debug
    
    // Limpiar el selector de ciudades
    regionSelect.innerHTML = '<option value="">Selecciona una ciudad...</option>';
    
    // Si hay un país seleccionado
    if (paisSeleccionado) {
        // Habilitar el selector de ciudades
        regionSelect.disabled = false;
        
        // Obtener las ciudades del país seleccionado
        const ciudades = ciudadesPorPais[paisSeleccionado];
        
        /*
        ¿Qué es forEach? Un método que ejecuta una función para cada elemento del array
        ¿Cómo funciona? ciudades.forEach(ciudad => { código para cada ciudad })
        */
        ciudades.forEach(ciudad => {
            // Crear un nuevo elemento <option>
            const option = document.createElement('option');
            option.value = ciudad;        // El valor interno
            option.textContent = ciudad;  // El texto que ve el usuario
            
            // Agregar la opción al selector
            regionSelect.appendChild(option);
        });
    } else {
        // Si no hay país seleccionado, deshabilitar ciudades
        regionSelect.disabled = true;
    }
    
    // Ocultar resultados anteriores
    resultadoDiv.style.display = 'none';
});

// EVENTO: Cuando se hace click en el botón consultar
consultarBtn.addEventListener('click', function() {
    const ciudad = regionSelect.value; // Obtener la ciudad seleccionada
    
    console.log('Consultando clima para:', ciudad); // Para debug
    
    // Validación: verificar que hay una ciudad seleccionada
    if (!ciudad) {
        alert('Por favor selecciona un país y una ciudad');
        return; // Salir de la función si no hay ciudad
    }
    
    // Mostrar la sección de resultados y el loading
    resultadoDiv.style.display = 'block';
    loadingDiv.style.display = 'block';
    climaDataDiv.style.display = 'none';
    
    // Llamar a la función para obtener el clima
    obtenerClima(ciudad);
});

// ====================================
// 4. FUNCIÓN PRINCIPAL - OBTENER CLIMA
// ====================================

/*
¿Qué es async/await? Una forma moderna de manejar operaciones asíncronas
¿Para qué sirve? Para esperar respuestas de APIs sin bloquear la página
¿Cómo funciona? 'async' declara que la función es asíncrona, 'await' espera el resultado
*/
async function obtenerClima(ciudad) {
    try {
        // ===== CONFIGURACIÓN DE LA API =====
        
        // TU API KEY REAL de OpenWeatherMap
        const API_KEY = 'cdaf84c2483cc80331bdd607f5b6082b'; // Tu clave específica  - link de pagina: https://home.openweathermap.org/api_keys
        
        // URL de la API con parámetros
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;
        
        /*
        Parámetros explicados:
        - q=${ciudad}: La ciudad a consultar
        - appid=${API_KEY}:  clave de autenticación
        - units=metric: Temperaturas en Celsius
        - lang=es: Descripciones en español
        */
        
        console.log('URL de consulta:', url); // Para debug
        
        // ===== LLAMADA A LA API =====
        
        /*
        ¿Qué es fetch? Una función moderna para hacer peticiones HTTP
        ¿Qué devuelve? Una Promise que se resuelve con la respuesta
        */
        const response = await fetch(url);
        
        // ===== MANEJO DE ERRORES =====
        
        /*
        ¿Qué es response.ok? Una propiedad que indica si la respuesta fue exitosa (200-299)
        ¿Por qué verificar? Porque fetch() no lanza error automáticamente para códigos HTTP de error
        */
        if (!response.ok) {
            // Diferentes tipos de error según el código HTTP
            if (response.status === 404) {
                throw new Error('Ciudad no encontrada');
            } else if (response.status === 401) {
                throw new Error('API Key inválida');
            } else if (response.status === 429) {
                throw new Error('Límite de consultas excedido');
            } else {
                throw new Error(`Error HTTP: ${response.status}`);
            }
        }
        
        // ===== PROCESAR RESPUESTA =====
        
        /*
        ¿Qué es .json()? Un método que convierte la respuesta JSON en un objeto JavaScript
        ¿Por qué await? Porque es una operación asíncrona
        */
        const datosClima = await response.json();
        
        console.log('Datos recibidos de la API:', datosClima); // Para debug
        
        // Mostrar los datos en la interfaz
        mostrarClima(datosClima);
        
    } catch (error) {
        // ===== MANEJO DE ERRORES =====
        
        console.error('Error al obtener el clima:', error);
        
        // Mostrar diferentes mensajes según el tipo de error
        let mensajeError;
        
        if (error.message.includes('Ciudad no encontrada')) {
            mensajeError = `No se encontró información del clima para "${ciudad}". Verifica el nombre.`;
        } else if (error.message.includes('API Key')) {
            mensajeError = 'Error de autenticación. Verifica la API Key.';
        } else if (error.message.includes('Failed to fetch')) {
            mensajeError = 'Error de conexión. Verifica tu internet.';
        } else if (error.message.includes('Límite')) {
            mensajeError = 'Has excedido el límite de consultas. Intenta más tarde.';
        } else {
            mensajeError = 'Error al consultar el clima. Inténtalo de nuevo.';
        }
        
        mostrarError(mensajeError);
    }
}

// ====================================
// 5. FUNCIÓN PARA MOSTRAR EL CLIMA
// ====================================

/*
¿Qué hace esta función? Toma los datos de la API y los convierte en HTML bonito
¿Por qué separada? Para mantener el código organizado y reutilizable
*/
function mostrarClima(datos) {
    // Ocultar el indicador de carga
    loadingDiv.style.display = 'none';
    
    // ===== PROCESAR DATOS =====
    
    // Obtener icono emoji según el clima
    const iconoClima = obtenerIconoClima(datos.weather[0].main);
    
    // Convertir velocidad del viento de m/s a km/h
    const vientoKmh = Math.round(datos.wind.speed * 3.6);
    
    // ===== CREAR HTML DINÁMICO =====
    
    /*
    ¿Qué son las template literals? Cadenas de texto que permiten insertar variables
    ¿Cómo se usan? Con backticks `` y ${variable} para insertar valores
    ¿Por qué útiles? Permiten crear HTML complejo con datos dinámicos
    */
    const climaHTML = `
        <div class="clima-info">
            <!-- Título con ciudad y país -->
            <h2>
                <i class="fas fa-map-marker-alt"></i> 
                ${datos.name}, ${datos.sys.country}
            </h2>
            
            <!-- Información principal del clima -->
            <div class="clima-principal">
                <div class="icono-clima">${iconoClima}</div>
                <div class="temperatura">${Math.round(datos.main.temp)}°C</div>
            </div>
            
            <!-- Descripción del clima -->
            <div class="descripcion">${datos.weather[0].description}</div>
            
            <!-- Grid con información detallada -->
            <div class="info-grid">
                
                <div class="info-item">
                    <div class="info-icon"><i class="fas fa-thermometer-half"></i></div>
                    <div><strong>Sensación Térmica</strong></div>
                    <div>${Math.round(datos.main.feels_like)}°C</div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon"><i class="fas fa-tint"></i></div>
                    <div><strong>Humedad</strong></div>
                    <div>${datos.main.humidity}%</div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon"><i class="fas fa-wind"></i></div>
                    <div><strong>Viento</strong></div>
                    <div>${vientoKmh} km/h</div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon"><i class="fas fa-compress-arrows-alt"></i></div>
                    <div><strong>Presión</strong></div>
                    <div>${datos.main.pressure} hPa</div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon"><i class="fas fa-arrow-up"></i></div>
                    <div><strong>Temperatura Máxima</strong></div>
                    <div>${Math.round(datos.main.temp_max)}°C</div>
                </div>
                
                <div class="info-item">
                    <div class="info-icon"><i class="fas fa-arrow-down"></i></div>
                    <div><strong>Temperatura Mínima</strong></div>
                    <div>${Math.round(datos.main.temp_min)}°C</div>
                </div>
                
            </div>
            
            <!-- Información adicional -->
            <div class="info-adicional">
                <small>
                    <i class="fas fa-clock"></i> 
                    Datos actualizados: ${new Date().toLocaleTimeString('es-ES')}
                </small>
                <small>
                    <i class="fas fa-satellite"></i> 
                    Fuente: Estaciones meteorológicas de OpenWeatherMap
                </small>
            </div>
            
        </div>
    `;
    
    // ===== INSERTAR EN EL DOM =====
    
    /*
    ¿Qué es innerHTML? Una propiedad que permite cambiar el HTML interno de un elemento
    ¿Cómo funciona? Reemplaza todo el contenido HTML del elemento
    */
    climaDataDiv.innerHTML = climaHTML;
    climaDataDiv.style.display = 'block'; // Hacer visible el contenedor
}

// ====================================
// 6. FUNCIÓN PARA ICONOS DEL CLIMA
// ====================================

/*
¿Para qué sirve? Convierte el código del clima de la API en emojis bonitos
¿Cómo funciona? Recibe 'Rain' y devuelve '🌧️'
*/
function obtenerIconoClima(condicion) {
    /*
    ¿Qué es este objeto? Un "diccionario" que mapea condiciones a emojis
    ¿Por qué útil? Nos permite mostrar iconos visuales en lugar de texto
    */
    const iconos = {
        'Clear': '☀️',          // Cielo despejado
        'Clouds': '☁️',         // Nublado
        'Rain': '🌧️',          // Lluvia
        'Drizzle': '🌦️',       // Llovizna
        'Thunderstorm': '⛈️',   // Tormenta
        'Snow': '❄️',          // Nieve
        'Mist': '🌫️',          // Neblina
        'Fog': '🌫️',           // Niebla
        'Haze': '🌫️',          // Bruma
        'Smoke': '🌫️',         // Humo
        'Dust': '🌪️',          // Polvo
        'Sand': '🌪️',          // Arena
        'Ash': '🌋',            // Ceniza volcánica
        'Squall': '💨',         // Ráfaga
        'Tornado': '🌪️'        // Tornado
    };
    
    /*
    ¿Qué es || ? El operador "OR" lógico
    ¿Cómo funciona? Si iconos[condicion] existe, lo usa. Si no, usa '🌤️'
    ¿Por qué necesario? Para tener un ícono por defecto si la condición no está en nuestro diccionario
    */
    return iconos[condicion] || '🌤️'; // Ícono por defecto
}

// ====================================
// 7. FUNCIÓN PARA MOSTRAR ERRORES
// ====================================

/*
¿Para qué sirve? Mostrar mensajes de error de forma elegante
¿Por qué separada? Para reutilizar código y mantener consistencia
*/
function mostrarError(mensaje) {
    // Ocultar el indicador de carga
    loadingDiv.style.display = 'none';
    
    // Crear HTML para el mensaje de error
    const errorHTML = `
        <div class="text-center">
            <i class="fas fa-exclamation-triangle" 
               style="font-size: 3rem; color: var(--accent-color); margin-bottom: 20px;"></i>
            <h3>¡Oops! Algo salió mal</h3>
            <p style="font-size: 1.1rem; color: #666; margin: 20px 0;">${mensaje}</p>
            <button class="btn btn-clima" onclick="location.reload()">
                <i class="fas fa-redo"></i> Intentar de nuevo
            </button>
        </div>
    `;
    
    // Mostrar el error en el contenedor
    climaDataDiv.innerHTML = errorHTML;
    climaDataDiv.style.display = 'block';
}

// ====================================
// 8. FUNCIONES DE UTILIDAD
// ====================================

/*
Funciones adicionales que pueden ser útiles para el futuro
*/

// Función para formatear fechas
function formatearFecha(timestamp) {
    /*
    ¿Qué es timestamp? Un número que representa un momento en el tiempo
    ¿Cómo convertirlo? new Date(timestamp * 1000) porque la API usa segundos y JS usa milisegundos
    */
    const fecha = new Date(timestamp * 1000);
    return fecha.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });
}

// Función para obtener dirección del viento
function obtenerDireccionViento(grados) {
    /*
    ¿Qué son los grados? La dirección del viento en grados (0-360)
    ¿Cómo funciona? 0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste
    */
    const direcciones = [
        'Norte', 'Norte-Noreste', 'Noreste', 'Este-Noreste',
        'Este', 'Este-Sureste', 'Sureste', 'Sur-Sureste',
        'Sur', 'Sur-Suroeste', 'Suroeste', 'Oeste-Suroeste',
        'Oeste', 'Oeste-Noroeste', 'Noroeste', 'Norte-Noroeste'
    ];
    
    /*
    ¿Cómo calcular? Dividir 360° en 16 direcciones = 22.5° por dirección
    Math.round() redondea al entero más cercano
    % 16 asegura que el índice esté entre 0-15
    */
    const indice = Math.round(grados / 22.5) % 16;
    return direcciones[indice];
}

// ====================================
// 9. INICIALIZACIÓN
// ====================================

/*
Código que se ejecuta cuando la página termina de cargar
*/
document.addEventListener('DOMContentLoaded', function() {
    console.log('ClimaLatino cargado correctamente');
    console.log('Países disponibles:', Object.keys(ciudadesPorPais));
    
    // Agregar mensaje de bienvenida en la consola
    console.log(`
    🌤️ CLIMALATINO - APLICACIÓN DE CLIMA
    ====================================
    ✅ API Key configurada
    ✅ ${Object.keys(ciudadesPorPais).length} países disponibles
    ✅ Datos en tiempo real de OpenWeatherMap
    
    ¡Selecciona un país y ciudad para ver el clima!
    `);
});

/*
===============================================
RESUMEN DE CÓMO FUNCIONA LA APLICACIÓN:
===============================================

1. 📋 DATOS: Tenemos una base de datos de ciudades por país
2. 🎮 EVENTOS: Escuchamos cuando el usuario selecciona país/ciudad
3. 🌐 API: Hacemos una petición real a OpenWeatherMap
4. 📊 DATOS: Recibimos datos reales del clima
5. 🎨 UI: Convertimos los datos en HTML bonito
6. 👀 MOSTRAR: Actualizamos la interfaz con los resultados

FLUJO PASO A PASO:
Usuario selecciona país → Se llenan las ciudades → 
Usuario selecciona ciudad → Hace clic en consultar →
Se muestra loading → Se llama a la API → 
Se procesan los datos → Se muestra el resultado

¡Es una aplicación web completa y funcional! 🚀
*/