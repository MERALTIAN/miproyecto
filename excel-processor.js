const XLSX = require("xlsx");

exports.handler = async (event) => {
  try {
    console.log("Evento recibido:", JSON.stringify(event, null, 2));

    // El archivo Excel llega en base64 desde la app
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { archivoBase64 } = body || {};

    if (!archivoBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ mensaje: "Falta archivoBase64" }),
      };
    }

    // Convertir base64 a buffer
    const bufferArchivo = Buffer.from(archivoBase64, "base64");

    if (bufferArchivo.length === 0) {
      throw new Error("Buffer vacío: base64 inválido");
    }

    // Leer el Excel
    console.log("Leyendo Excel con XLSX...");
    const workbook = XLSX.read(bufferArchivo, { type: "buffer" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) {
      throw new Error("No se encontró hoja en el workbook");
    }

    // Convertir a JSON (cada fila = objeto)
    const datosProcesados = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    console.log("Datos procesados:", datosProcesados); // Log preview

    // Retornar datos procesados a la app
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ datos: datosProcesados }),
    };

  } catch (error) {
    console.error("Error procesando Excel:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        mensaje: "Error procesando Excel",
        error: error.message
      }),
    };
  }
};
