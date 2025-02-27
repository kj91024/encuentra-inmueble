/**
 * Convierte una fecha y hora en formato ISO 8601 a un formato legible en UTC-5.
 *
 * Esta función toma una cadena de fecha en formato ISO 8601 y la convierte a un formato más legible como "dd/mm/yyyy hh:mm". Además, ajusta la hora a la zona horaria UTC-5.
 * Si el valor de entrada es `undefined` o `null`, devuelve "Sin definir".
 *
 * @param {string} datetime - La fecha y hora en formato ISO 8601 (por ejemplo, "2025-01-06T14:30:00").
 * @returns {string} La fecha y hora formateada en "dd/mm/yyyy hh:mm".
 */
const prettyDate = (datetime) => {
    if(datetime === undefined || datetime === null) return 'Sin definir';
    // Crear un objeto Date desde la cadena
    const dateUTC = new Date(datetime.replace('T', ' ') + 'Z'); // Añadir 'Z' para tratarlo como UTC
    // Ajustar a UTC-5
    const localDate = new Date(dateUTC.getTime() + (5 * 60 * 60 * 1000));
    // const localDate = new Date(dateUTC.getTime());

    // Obtener las partes de la fecha y la hora
    let day = String(localDate.getUTCDate()).padStart(2, '0');
    let month = String(localDate.getUTCMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    let year = localDate.getUTCFullYear();
    let hours = String(localDate.getUTCHours()).padStart(2, '0');
    let minutes = String(localDate.getUTCMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Devuelve una cadena que describe cuánto tiempo ha pasado desde una fecha determinada.
 *
 * Esta función calcula el tiempo transcurrido entre la fecha proporcionada y la fecha actual en segundos, minutos, horas, días, meses o años, y devuelve una cadena que representa ese tiempo en un formato legible como "Hace X minutos" o "Hace X años".
 * Si el valor proporcionado es `undefined` o `null`, la función devuelve el carácter '~'.
 *
 * @param {string|Date} n - La fecha de la que calcular el tiempo transcurrido. Puede ser una cadena de fecha o un objeto Date.
 * @returns {string} Una cadena que indica cuánto tiempo ha pasado desde la fecha proporcionada.
 */
const timeAgo = (n) => {
    if(n === undefined || n === null) return '~';
    var e = Date.now() - (5 * 60 * 60 * 1000);
    n = Date.parse(n);
    var r = (e - n) / 1e3,
        a = r / 60,
        t = r / 3600;
    if (r <= 0) return 'Hace un momento';
    if (r < 60 && a < 1) return 1 === r ? 'Hace ' + Math.round(r) + ' segundo' : 'Hace ' + Math.round(r) + ' segundos';
    if (a < 60 && t < 1) return 1 === a ? 'Hace ' + Math.round(a) + ' minuto' : 'Hace ' + Math.round(a) + ' minutos';
    if (t > 24) {
        var o = t / 24;
        if (o > 30) {
            var i = o / 30;
            if (i > 12) {
                var u = i / 12;
                if (u > 0) return 1 === u ? 'Hace ' + Math.ceil(u) + ' año' : 'Hace ' + Math.ceil(u) + ' años'
            }
            return 'Hace ' + Math.round(i) + ' mes'
        }
        return 1 === o ? 'Hace ' + Math.round(o) + ' día' : 'Hace ' + Math.round(o) + ' días'
    }
    return 1 === t ? 'Hace ' + Math.round(t) + ' hora' : 'Hace ' + Math.round(t) + ' horas'
}

/**
 * Convierte un número total de segundos en un formato de horas y minutos (HH:mm).
 *
 * Esta función toma un número total de segundos y lo convierte a un formato legible de horas y minutos.
 * Si el número de segundos proporcionado es `undefined` o `null`, la función retorna `null`.
 * Si el valor de los segundos es menor a una hora, la función devolverá un formato con ceros a la izquierda, por ejemplo "01:05" para 65 segundos.
 *
 * @param {number} totalSeconds - El número total de segundos a convertir.
 * @returns {string|null} El tiempo formateado en horas y minutos en formato "HH:mm" o `null` si el valor proporcionado es inválido.
 */
const secondsToHHMM = (totalSeconds) => {
    if(totalSeconds === undefined || totalSeconds === null) {
        return null;
    }
    const hours = Math.floor(totalSeconds / 3600); // Obtener horas
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Obtener minutos
    const seconds = totalSeconds % 60; // Obtener segundos restantes

    // Asegurar formato de dos dígitos con padStart
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
}

/**
 * Convierte un número total de segundos en un formato de horas, minutos y segundos (HH:mm:ss).
 *
 * Esta función toma un número total de segundos y lo convierte a un formato legible de horas, minutos y segundos.
 * Si el número de segundos proporcionado es `undefined` o `null`, la función retorna `null`.
 * El formato resultante siempre tendrá dos dígitos para las horas, minutos y segundos, por ejemplo, "01:05:09" para 3909 segundos.
 *
 * @param {number} totalSeconds - El número total de segundos a convertir.
 * @returns {string|null} El tiempo formateado en horas, minutos y segundos en formato "HH:mm:ss" o `null` si el valor proporcionado es inválido.
 */
const secondsToHHMMSS = (totalSeconds) => {
    if(totalSeconds === undefined || totalSeconds === null) {
        return null;
    }
    const hours = Math.floor(totalSeconds / 3600); // Obtener horas
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Obtener minutos
    const seconds = totalSeconds % 60; // Obtener segundos restantes

    // Asegurar formato de dos dígitos con padStart
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Convierte una cadena de tiempo en formato "HH:mm" a su equivalente en segundos.
 *
 * Esta función toma una cadena de tiempo en formato "HH:mm" y la convierte a su equivalente en segundos.
 * Si el formato no es válido o los valores de horas y minutos no son razonables, se lanza un error.
 * Si el valor proporcionado es `undefined` o `null`, la función retorna `null`.
 *
 * @param {string} time - La cadena de tiempo en formato "HH:mm".
 * @returns {number|null} El total de segundos correspondiente al tiempo proporcionado o `null` si el valor es inválido.
 * @throws {Error} Si el formato de la cadena no es "HH:mm" o si las horas o los minutos son inválidos.
 */
const HHMMToSeconds = (time) => {
    if(time === undefined || time === null) {
        return null;
    }

    // Verificar que el formato sea válido (HH:mm)
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
        throw new Error("El formato debe ser HH:mm");
    }

    const hours = parseInt(timeParts[0], 10); // Obtener las horas
    const minutes = parseInt(timeParts[1], 10); // Obtener los minutos

    // Validar que las horas y minutos sean valores razonables
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error("Las horas o los minutos son inválidos");
    }

    // Calcular el total de segundos
    return (hours * 3600) + (minutes * 60);
}

/**
 * Calcula el tiempo restante hasta la fecha de expiración.
 *
 * Esta función calcula la diferencia entre la fecha actual y la fecha de expiración proporcionada,
 * y devuelve un mensaje indicando cuánto tiempo falta para la expiración. Si la fecha de expiración ya ha pasado,
 * la función devuelve "Ya expiró". Si la fecha de expiración es futura, el resultado indica el tiempo restante en días,
 * horas, minutos o segundos, dependiendo de cuál sea la unidad más significativa.
 *
 * @param {string|Date} expirationDate - La fecha de expiración en formato de cadena o como un objeto `Date`.
 * @returns {string} Un mensaje indicando el tiempo restante hasta la expiración, o "Ya expiró" si la fecha ya pasó.
 */
const timeUntilExpiration = (expirationDate) => {
    const now = Date.now() - (5 * 60 * 60 * 1000);
    const expiration = new Date(expirationDate).getTime();

    // Calcular la diferencia en milisegundos
    const difference = expiration - now;

    // Si la fecha ya pasó
    if (difference <= 0) {
        return "Ya expiró";
    }

    // Convertir la diferencia a días, horas, minutos y segundos
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) return `Expira en ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Expira en ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Expira en ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return `Expira en ${seconds} segundo${seconds > 1 ? 's' : ''}`;
}

export {
    prettyDate, timeAgo, secondsToHHMM, secondsToHHMMSS, HHMMToSeconds, timeUntilExpiration
}