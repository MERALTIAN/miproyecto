import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system"; 
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, query, where, orderBy, limit } from "firebase/firestore";
import FormularioProductos from "../Components/FormularioProductos.js";
import TablaProductos from "../Components/TablaProductos.js";

const Productos = ({ cerrarSesion }) => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [idProducto, setIdProducto] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // --- Función de tu proyecto (Productos) ---
  const extraerYGuardarProductos = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert("Cancelado", "No se seleccionó ningún archivo.");
        return;
      }

      const { uri, name } = result.assets[0];
      console.log(`Archivo seleccionado: ${name} en ${uri}`);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch("https://simon123.execute-api.us-east-1.amazonaws.com/extraerexcel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archivoBase64: base64 }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP en Lambda: ${response.status}`);
      }

      const body = await response.json();
      const { datos } = body;

      if (!datos || !Array.isArray(datos) || datos.length === 0) {
        Alert.alert("Error", "No se encontraron datos en el Excel o el archivo está vacío.");
        return;
      }

      console.log("Datos extraídos del Excel:", datos);

      let guardados = 0;
      let errores = 0;

      for (const producto of datos) {
        try {
          await addDoc(collection(db, "productos"), {
            nombre: producto.nombre || "",
            precio: parseFloat(producto.precio) || 0,
          });
          guardados++;
        } catch (err) {
          console.error("Error guardando producto:", producto, err);
          errores++;
        }
      }

      Alert.alert(
        "Éxito",
        `Se guardaron ${guardados} productos en la colección. Errores: ${errores}.`,
        [{ text: "OK" }]
      );
      cargarDatos(); // Recargar la lista de productos
    } catch (error) {
      console.error("Error en extraerYGuardarProductos:", error);
      Alert.alert("Error", `Error procesando el Excel: ${error.message}`);
    }
  };

  // --- NUEVA FUNCIÓN (de la tarea) ---
  const extraerYGuardarMascotas = async () => {
    try {
      // Abrir selector de documentos para elegir archivo Excel
      const result = await DocumentPicker.getDocumentAsync({ // [cite: 44]
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'], // [cite: 44]
        copyToCacheDirectory: true, // [cite: 44]
      });

      if (result.canceled || !result.assets || result.assets.length === 0) { // [cite: 44]
        Alert.alert("Cancelado", "No se seleccionó ningún archivo."); // [cite: 44]
        return; // [cite: 44]
      }

      const { uri, name } = result.assets[0]; // [cite: 44]
      console.log(`Archivo seleccionado: ${name} en ${uri}`); // [cite: 44]

      // Leer el archivo como base64
      const base64 = await FileSystem.readAsStringAsync(uri, { // [cite: 44]
        encoding: FileSystem.EncodingType.Base64, // [cite: 44]
      });

      // Enviar a Lambda para procesar [cite: 44]
      // Asegúrate que esta URL sea tu URL de API Gateway
      const response = await fetch("https://simon123.execute-api.us-east-1.amazonaws.com/extraerexcel", { // [cite: 44]
        method: "POST", // [cite: 44]
        headers: { // [cite: 44]
          "Content-Type": "application/json", // [cite: 44]
        },
        body: JSON.stringify({ archivoBase64: base64 }), // [cite: 44]
      });

      if (!response.ok) { // [cite: 44]
        throw new Error(`Error HTTP en Lambda: ${response.status}`); // [cite: 44]
      }

      const body = await response.json(); // [cite: 44]
      const { datos } = body; // [cite: 44]

      if (!datos || !Array.isArray(datos) || datos.length === 0) { // [cite: 44]
        Alert.alert("Error", "No se encontraron datos en el Excel o el archivo está vacío."); // [cite: 44]
        return; // [cite: 44]
      }

      console.log("Datos extraídos del Excel:", datos); // [cite: 44]

      // Guardar cada fila en la colección 'mascotas' [cite: 44]
      let guardados = 0; // [cite: 44]
      let errores = 0; // [cite: 44]

      for (const mascota of datos) { // [cite: 44]
        try {
          // Columnas 'nombre', 'edad', 'raza' (ajusta si los headers son diferentes) [cite: 44]
          await addDoc(collection(db, "mascotas"), { // Colección "mascotas" [cite: 44, 46]
            nombre: mascota.nombre || "", // [cite: 44]
            edad: parseInt(mascota.edad) || 0, // [cite: 44]
            raza: mascota.raza || "" // [cite: 44]
          });
          guardados++; // [cite: 44]
        } catch (err) { // [cite: 44]
          console.error("Error guardando mascota:", mascota, err); // [cite: 44]
          errores++; // [cite: 44]
        }
      }

      Alert.alert( // [cite: 44]
        "Éxito", // [cite: 44]
        `Se guardaron ${guardados} mascotas en la colección. Errores: ${errores}.`, // [cite: 44]
        [{ text: "OK" }] // [cite: 44]
      );

    } catch (error) { // [cite: 44]
      console.error("Error en extraerYGuardarMascotas:", error); // [cite: 44]
      Alert.alert("Error", `Error procesando el Excel: ${error.message}`); // [cite: 44]
    }
  };
  // --- FIN NUEVA FUNCIÓN ---


  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos(); // Recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const manejoCambio = (campo, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio) {
      try {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar producto:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const actualizarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio && idProducto) {
      try {
        await updateDoc(doc(db, "productos", idProducto), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setIdProducto(null);
        setModoEdicion(false);
        cargarDatos();
      } catch (error) {
        console.error("Error al actualizar producto:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({ nombre: producto.nombre, precio: producto.precio.toString() });
    setIdProducto(producto.id);
    setModoEdicion(true);
  };


  const obtenerCiudadesGuatemalaMasPobladas = async () => {
    try {
      console.log(" Consulta: Obtener las 2 ciudades más pobladas de Guatemala");

      const ref = collection(db, "ciudades");
      const q = query(
        ref,
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("No hay ciudades de Guatemala.");
        return;
      }

      console.log("Resultados:");
      snapshot.forEach((doc) => {
        console.log(`ID: ${doc.id}`, doc.data());
      });
    } catch (error) {
      console.error("Error en la consulta:", error);
    }
  };

  const listarCiudadesHonduras = async () => {
    try {
      const ciudadesRef = collection(db, "ciudades");

      // La consulta compuesta usa dos 'where' y un 'orderBy' [cite: 42, 47]
      const q = query(
        ciudadesRef,
        where("pais", "==", "Honduras"), // Filtro de igualdad [cite: 34]
        where("poblacion", ">", 700), // Filtro de rango (población mayor a 700k) [cite: 36]
        orderBy("nombre", "asc"), // Ordenar por nombre ascendente [cite: 49]
        limit(3)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No se encontraron ciudades de Honduras con población mayor a 700k.");
        return;
      }

      console.log("--- 2. Ciudades de Honduras > 700k ---");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(
          `ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}k, País: ${data.pais}`
        );
      });

    } catch (error) {
      console.error("Error al obtener ciudades de Honduras:", error);
    }
  };

  const listarCiudadesElSalvador = async () => {
    try {
      const ciudadesRef = collection(db, "ciudades");

      // Consulta por país, orden ascendente de población [cite: 42, 49]
      const q = query(
        ciudadesRef,
        where("pais", "==", "El Salvador"),
        orderBy("poblacion", "asc"),
        limit(2)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No se encontraron ciudades de El Salvador.");
        return;
      }

      console.log("--- 3. Ciudades de El Salvador (población ascendente) ---");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}`);
      });
    } catch (error) {
      console.error("Error al obtener ciudades de El Salvador:", error);
    }
  };


  const listarCiudadesCentroamerica = async () => {
    try {
      const ciudadesRef = collection(db, "ciudades");

      // Consulta con filtro de rango y orden descendente por país [cite: 42, 47]
      const q = query(
        ciudadesRef,
        where("poblacion", "<=", 300000),
        orderBy("pais", "desc"),
        limit(4)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No se encontraron ciudades centroamericanas con población ≤ 300k.");
        return;
      }

      console.log("--- 4. Ciudades centroamericanas ≤ 300k ---");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}, País: ${data.pais}`);
      });
    } catch (error) {
      console.error("Error al obtener ciudades centroamericanas:", error);
    }
  };


  const obtenerCiudadesPoblacionAlta = async () => {
    try {
      const ciudadesRef = collection(db, "ciudades");

      // 1. Construir la consulta con query()
      // Filtra por población > 900k, ordena por nombre, y limita a 3.
      const q = query(
        ciudadesRef,
        where("poblacion", ">", 900), // Filtro de rango (Población mayor a 900k)
        orderBy("nombre", "asc"), // Ordenar por nombre (ascendente por defecto)
        limit(3) // Limitar a las 3 primeras
      );

      // 2. Ejecutar la consulta con getDocs()
      const querySnapshot = await getDocs(q);

      // 3. Verificar y manejar resultados
      if (querySnapshot.empty) {
        console.log("No se encontraron ciudades con población mayor a 900k.");
        return;
      }

      // 4. Imprimir resultados con formato legible
      console.log("--- 5. 3 Ciudades con Población > 900k ---");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(
          `ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}k, País: ${data.pais}`
        );
      });

    } catch (error) {
      // 5. Manejar errores con try-catch
      console.error("Error al obtener ciudades de población alta:", error);
      // Si hay un error, el mensaje de error de Firebase te indicará el enlace para crear el índice.
    }
  };


  const listarCiudadesGuatemalaCompleto = async () => {
    try {
      const ciudadesRef = collection(db, "ciudades");

      // 1. Construir la consulta con query()
      const q = query(
        ciudadesRef,
        where("pais", "==", "Guatemala"), // Filtrar por Guatemala
        orderBy("poblacion", "desc"), // Ordenar por población descendente
        limit(5) // Limitar a 5 por seguridad, como se indica
      );

      // 2. Ejecutar la consulta con getDocs()
      const querySnapshot = await getDocs(q);

      // 3. Verificar y manejar resultados
      if (querySnapshot.empty) {
        console.log("No se encontraron ciudades de Guatemala.");
        return;
      }

      // 4. Imprimir resultados con formato legible
      console.log("--- 6. Ciudades de Guatemala (Top 5) ---");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(
          `ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}k, País: ${data.pais}`
        );
      });

    } catch (error) {
      // 5. Manejar errores con try-catch
      console.error("Error al obtener todas las ciudades de Guatemala:", error);
    }
  };


  const obtenerCiudadesRangoPoblacion = async () => {
    try {
      const ciudadesRef = collection(db, "ciudades");

      // 1. Construir la consulta con query()
      // Combina dos cláusulas 'where' en el mismo campo para un rango
      const q = query(
        ciudadesRef,
        where("poblacion", ">=", 200), // Rango inferior (>= 200k)
        where("poblacion", "<=", 600), // Rango superior (<= 600k)
        orderBy("pais", "asc"), // Ordenar por país ascendente
        limit(5) // Limitar a 5 resultados
      );

      // 2. Ejecutar la consulta con getDocs()
      const querySnapshot = await getDocs(q);

      // 3. Verificar y manejar resultados
      if (querySnapshot.empty) {
        console.log("No se encontraron ciudades con población entre 200k y 600k."); // Verificar si no hay resultados
        return;
      }

      // 4. Imprimir resultados con formato legible
      console.log("--- 7. Ciudades entre 200k y 600k (Top 5) ---");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(
          `ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}k, País: ${data.pais}`
        );
      });

    } catch (error) {
      // 5. Manejar errores con try-catch
      console.error("Error al obtener ciudades por rango de población:", error);
    }
  };


  const obtenerCiudadesMayorPoblacionGeneral = async () => {
    try {
      const ciudadesRef = collection(db, "ciudades");

      // 1. Construir la consulta con query()
      // Primero ordenamos por población (mayor a menor) para obtener las "más pobladas",
      // y luego ordenamos por región (desc), como se pide. 
      // Nota: Firestore ejecuta el orderBy en el orden en que se especifican.
      const q = query(
        ciudadesRef,
        orderBy("poblacion", "desc"), // Orden principal: Mayor Población
        orderBy("region", "desc"), // Segundo ordenamiento: Región descendente
        limit(5) // Limitar a las 5 primeras
      );

      // 2. Ejecutar la consulta con getDocs()
      const querySnapshot = await getDocs(q);

      // 3. Verificar y manejar resultados
      if (querySnapshot.empty) {
        console.log("No se encontró ninguna ciudad."); // Verificar si no hay resultados
        return;
      }

      // 4. Imprimir resultados con formato legible
      console.log("--- 8. 5 Ciudades con Mayor Población (Ordenado por Región Desc.) ---");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(
          `ID: ${doc.id}, Nombre: ${data.nombre}, Población: ${data.poblacion}k, País: ${data.pais}, Región: ${data.region}`
        );
      });

    } catch (error) {
      // 5. Manejar errores con try-catch
      console.error("Error al obtener las 5 ciudades más pobladas:", error);
    }
  };


  useEffect(() => {
    obtenerCiudadesGuatemalaMasPobladas();
    listarCiudadesHonduras();
    listarCiudadesElSalvador();
    listarCiudadesCentroamerica();
    obtenerCiudadesPoblacionAlta();
    listarCiudadesGuatemalaCompleto();
    obtenerCiudadesRangoPoblacion();
    obtenerCiudadesMayorPoblacionGeneral();
    cargarDatos();

  }, []);

  return (
    <View style={styles.container}>
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
      
      {/* Botón de tu proyecto */}
      <View style={{ marginVertical: 10 }}>
        <Button title="Extraer Productos desde Excel" onPress={extraerYGuardarProductos} />
      </View>

      {/* --- BOTÓN AÑADIDO (de la tarea) --- */}
      <View style={{ marginVertical: 10 }}>
        <Button 
          title="Extraer Mascotas desde Excel"
          onPress={extraerYGuardarMascotas}
        />
      </View>
      {/* --- FIN BOTÓN AÑADIDO --- */}

      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />
      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2.7, padding: 20 },
});

export default Productos;