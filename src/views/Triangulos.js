import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import FormularioTriangulo from "../Components/FormularioTriangulo.js";
import TablaTriangulo from "../Components/TablaTriangulo.js";
import TituloArea from "../Components/TituloArea.js";

const Triangulo = () => {
  const [triangulos, setTriangulos] = useState([]);
  const [areaTotal, setAreaTotal] = useState(null);

  // Cargar datos y calcular áreas
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "triangulos"));
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        area: (docSnap.data().base * docSnap.data().altura) / 2,
      }));
      setTriangulos(data);

      if (data.length > 0) {
        const totalArea = data.reduce((sum, item) => sum + item.area, 0);
        setAreaTotal(totalArea);
      } else {
        setAreaTotal(null);
      }
    } catch (error) {
      console.error("Error al obtener triángulos:", error);
    }
  };

  // Eliminar triángulo
  const eliminarTriangulo = async (id) => {
    try {
      await deleteDoc(doc(db, "triangulos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TituloArea area={areaTotal} />
      <FormularioTriangulo cargarDatos={cargarDatos} />
      <TablaTriangulo triangulos={triangulos} eliminarTriangulo={eliminarTriangulo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});

export default Triangulo;