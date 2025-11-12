import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import ListaEdades from "../Components/ListaEdades.js";
import FormularioEdades from "../Components/FormularioEdades.js";
import TablaEdades from "../Components/TablaEdades.js";
import TituloPromedio from "../Components/TituloPromedio.js";


const Edades = () => {
const [promedio, setPromedio] = useState(null);
  const [edades, setEdades] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "edades"));
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setEdades(data);
       // Una vez que se cargan las edades, llama al método de calculo con la API
if (data. length > 0) {
calcularPromedioAPI(data);
} else {
setPromedio(null);

}
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarEdad = async (id) => {
    try {
      await deleteDoc(doc(db, "edades", id));
      cargarDatos(); // recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const calcularPromedioAPI = async (lista) => {
  try {
    const response = await fetch("https://om0cm1sojc.execute-api.us-east-2.amazonaws.com/calcular-promedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ edades: lista }),
    });

    const data = await response.json();
    setPromedio(data.promedio || null);
  } catch (error) {
    console.error("Error al calcular promedio en API:", error);
  }
 
};



  useEffect(() => {
    cargarDatos();

  }, []);

  return (
    <View style={styles.container}>
        <TituloPromedio promedio={promedio} />
      <FormularioEdades cargarDatos={cargarDatos} />
      <TablaEdades edades={edades} eliminarEdad={eliminarEdad} />
      {/* Si prefieres lista en vez de tabla, puedes usar:
          <ListaEdades edades={edades} />
      */}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2.7, padding: 20 },
});

export default Edades;
