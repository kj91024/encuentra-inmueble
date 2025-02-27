import {loadScript} from "./Utils.js";
import {prettyDate} from "./Time.js";

/**
 * Exporta los datos proporcionados a un archivo Excel en formato `.xlsx`.
 *
 * Esta función convierte los datos de una tabla representados en un arreglo de objetos a un archivo Excel utilizando la librería `xlsx`.
 * Primero, genera las cabeceras a partir de las claves del primer objeto en el arreglo. Luego, crea el archivo Excel y lo descarga con un nombre que incluye el nombre proporcionado y la fecha actual.
 *
 * @param {string} name - El nombre base para el archivo exportado.
 * @param {Array<Object>} rows - Un arreglo de objetos, donde cada objeto representa una fila de la tabla a exportar. Las claves del objeto serán usadas como encabezados de las columnas.
 *
 * @returns {void} - No retorna nada, pero inicia la descarga del archivo `.xlsx` generado.
 */
const exportData = async (name, rows) => {
    await loadScript("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.mini.min.js");

    const keys = Object.keys(rows[0]);
    let filename = name + " " + prettyDate((new Date()).toISOString().slice(0, 19).replace(/-/g, '/'));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
    XLSX.utils.sheet_add_aoa(worksheet, [keys], {origin: "A1"});
    XLSX.writeFile(workbook, `${filename}.xlsx`, {compression: true});
}

export {
    exportData
}