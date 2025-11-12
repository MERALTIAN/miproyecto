import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import FormularioIMC from "../Components/FormularioIMC.js";
import TablaIMC from "../Components/TablaIMC.js";
import TituloPromedioIMC from "../Components/TituloPromedioIMC.js";

const IMC = () => {
  const [imcs, setImcs] = useState([]);
  const [promedio, setPromedio] = useState(null);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "imcs"));
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setImcs(data);
      if (data.length > 0) {
        calcularPromedio(data);
      } else {
        setPromedio(null);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const calcularPromedio = (lista) => {
    const suma = lista.reduce((acc, item) => acc + (item.imc || 0), 0);
    setPromedio(lista.length ? suma / lista.length : null);
  };

  const agregarIMC = async (registro) => {
    try {
      // Guardar en Firebase
      await addDoc(collection(db, "imcs"), registro);
      cargarDatos();
    } catch (error) {
      console.error("Error al agregar IMC:", error);
    }
  };

  const eliminarIMC = async (id) => {
    try {
      await deleteDoc(doc(db, "imcs", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar IMC:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TituloPromedioIMC promedio={promedio} />
      <FormularioIMC agregarIMC={agregarIMC} />
      <TablaIMC imcs={imcs} eliminarIMC={eliminarIMC} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});

export default IMC;