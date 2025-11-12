import React from "react";
import { Text, StyleSheet } from "react-native";

const TituloArea = ({ area }) => {
  return (
    <Text style={styles.titulo}>
      {area !== null ? `Área: ${area.toFixed(2)} ` : "Sin datos para calcular área"}
    </Text>
  );
};

const styles = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
});

export default TituloArea;