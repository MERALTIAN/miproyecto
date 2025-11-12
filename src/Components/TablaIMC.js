import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import BotonEliminarIMC from "./BotonEliminarIMC.js";

const TablaIMC = ({ imcs, eliminarIMC }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de IMC</Text>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Peso (kg)</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Altura (m)</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Edad</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>IMC</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Categoría</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>
      <ScrollView>
        {imcs.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.pesoKg}</Text>
            <Text style={styles.celda}>{item.alturaM}</Text>
            <Text style={styles.celda}>{item.edad}</Text>
            <Text style={styles.celda}>{item.imc}</Text>
            <Text style={styles.celda}>{item.categoria}</Text>
            <View style={styles.celdaAcciones}>
              <BotonEliminarIMC id={item.id} eliminarIMC={eliminarIMC} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  fila: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#CCC", paddingVertical: 6, alignItems: "center" },
  encabezado: { backgroundColor: "#f0f0f0" },
  celda: { flex: 1, fontSize: 16, textAlign: "center" },
  celdaAcciones: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  textoEncabezado: { fontWeight: "bold", fontSize: 17, textAlign: "center" },
});

export default TablaIMC;