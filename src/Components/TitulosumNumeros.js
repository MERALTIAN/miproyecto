import React from "react";
import { Text, StyleSheet } from "react-native";

const TitulosumaNumeros = ({ resultado }) => {
  return (
    <Text style={styles.titulo}>
      {resultado !== null
        ? `Resultado de la Suma: ${resultado} `
        : "Sin datos para Sumar"}
    </Text>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
});

export default TitulosumaNumeros;