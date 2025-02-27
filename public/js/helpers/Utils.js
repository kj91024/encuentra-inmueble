const createDefaultForm = (keys, defaultValue = null) => {
    let data = {};
    keys.forEach(key => {
        data[key] = defaultData(defaultValue);
    });
    return data;
}

const valueRef = (data) => {
    const _data = {};
    Object.entries(data.value).forEach(([key, obj]) => {
        _data[key] = obj.value;
    });
    return _data;
}

const defaultData = (data = null) => {
    return {
        data: data,
        error: null,
        originalData: data,
        show: false,
    };
}

const loadScript = (src) => {
    if(window.idClient && src.indexOf("js/assets") !== -1 ){
        src = "../"+src;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const removeLoops = () => {
    Object.entries(window.loop).forEach(([name, instance]) => {
        clearInterval(instance);
        delete window.loop[name];
    })
}

const loop = (name, callback, seconds) => {
    if(!window.loop)        window.loop = {};
    if(!window.loop[name])  window.loop[name] = {};
    if(window.loop[name])   clearInterval(window.loop[name]);
    callback();
    if(seconds > 0) {
        window.loop[name] = setInterval(callback, seconds * 1000);
    }
}

const deepCopy = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(deepCopy);
    let clone = {};
    for (let key in obj) {
        clone[key] = deepCopy(obj[key]);
    }
    return clone;
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const pastelColorFromText = (text) => {
    // Crear un hash simple del texto
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convertir el hash en componentes RGB
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    // Ajustar para obtener colores pastel (mezclar con blanco)
    const pastelize = (color) => Math.floor((color + 255) / 2);

    const pastelR = pastelize(r);
    const pastelG = pastelize(g);
    const pastelB = pastelize(b);

    // Convertir a formato hexadecimal
    const toHex = (color) => color.toString(16).padStart(2, '0');
    return `#${toHex(pastelR)}${toHex(pastelG)}${toHex(pastelB)}`;
}

export {
    createDefaultForm, deepCopy, valueRef, defaultData, sleep,
    loop, removeLoops, loadScript, pastelColorFromText
}