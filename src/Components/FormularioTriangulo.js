import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, addDoc } from "firebase/firestore";

const FormularioTriangulo = ({ cargarDatos }) => {
  const [base, setBase] = useState("");
  const [altura, setAltura] = useState("");

  const guardarTriangulo = async () => {
    if (base && altura) {
      try {
        await addDoc(collection(db, "triangulos"), {
          base: parseFloat(base),
          altura: parseFloat(altura),
          unidad: "cm2", // Se guarda la unidad
        });
        setBase("");
        setAltura("");
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar triángulo:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Triángulo</Text>
      <TextInput
        style={styles.input}
        placeholder="Base"
        value={base}
        onChangeText={setBase}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Altura"
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
      />
      <Text style={styles.unidad}>Unidad: cm²</Text>
      <Button title="Guardar" onPress={guardarTriangulo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10 },
  unidad: { fontSize: 16, marginBottom: 10, textAlign: "center" },
});

export default FormularioTriangulo;