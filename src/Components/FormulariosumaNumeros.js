import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

// El componente se llama FormularioSumaNumeros para coincidir con tu estructura
const FormulariosumaNumeros = ({ cargarDatos }) => {
  // Cambiamos 'nombre' y 'edad' a 'num1' y 'num2'
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");

  const guardarSuma = async () => {
    // Validamos que ambos campos numéricos estén llenos
    if (num1 && num2) {
      try {
        // La colección de destino ahora es "sumas"
        await addDoc(collection(db, "sumas"), {
          // Guardamos ambos valores convertidos a números enteros
          num1: parseInt(num1),
          num2: parseInt(num2), 
        });
        
        // Limpiamos los campos del formulario
        setNum1("");
        setNum2("");
        
        // Recargamos los datos para actualizar la vista de suma
        cargarDatos(); 
      } catch (error) {
        console.error("Error al registrar números:", error);
        Alert.alert("Error", "Ocurrió un error al intentar guardar los números.");
      }
    } else {
      Alert.alert("Advertencia", "Por favor, complete ambos campos numéricos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Números para Suma</Text>

      <TextInput
        style={styles.input}
        placeholder="Número 1"
        value={num1}
        onChangeText={setNum1}
        // Usamos keyboardType="numeric" ya que son números
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Número 2"
        value={num2}
        onChangeText={setNum2}
        // Usamos keyboardType="numeric" ya que son números
        keyboardType="numeric"
      />

      <Button title="Guardar Sumandos" onPress={guardarSuma} />
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10 },
});

// Exportamos el nuevo componente
export default FormulariosumaNumeros;