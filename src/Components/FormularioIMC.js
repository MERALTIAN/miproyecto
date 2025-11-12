import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";

const FormularioIMC = ({ agregarIMC }) => {
  const [pesoKg, setPesoKg] = useState("");
  const [alturaM, setAlturaM] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [actividad, setActividad] = useState("");
  const [meta, setMeta] = useState("");

  const calcularIMC = async () => {
    if (!pesoKg || !alturaM || !edad || !genero || !actividad || !meta) {
      Alert.alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(
        "https://kaniefeqg5.execute-api.us-east-1.amazonaws.com/calcular-imc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pesoKg: parseFloat(pesoKg),
            alturaM: parseFloat(alturaM),
            edad: parseInt(edad),
            genero,
            actividad,
            meta,
          }),
        }
      );
      const data = await response.json();
      const registro = {
        pesoKg: parseFloat(pesoKg),
        alturaM: parseFloat(alturaM),
        edad: parseInt(edad),
        genero,
        actividad,
        meta,
        imc: data.imc,
        categoria: data.categoria,
      };
      agregarIMC(registro);
      // Limpiar campos
      setPesoKg("");
      setAlturaM("");
      setEdad("");
      setGenero("");
      setActividad("");
      setMeta("");
    } catch (error) {
      console.error("Error al calcular IMC:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="numeric"
        value={pesoKg}
        onChangeText={setPesoKg}
      />
      <TextInput
        style={styles.input}
        placeholder="Altura (m)"
        keyboardType="numeric"
        value={alturaM}
        onChangeText={setAlturaM}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        value={edad}
        onChangeText={setEdad}
      />
      <TextInput
        style={styles.input}
        placeholder="Género"
        value={genero}
        onChangeText={setGenero}
      />
      <TextInput
        style={styles.input}
        placeholder="Actividad (baja/media/alta)"
        value={actividad}
        onChangeText={setActividad}
      />
      <TextInput
        style={styles.input}
        placeholder="Meta (bajar/mantener/subir)"
        value={meta}
        onChangeText={setMeta}
      />
      <Button title="Calcular IMC" onPress={calcularIMC} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
});

export default FormularioIMC;