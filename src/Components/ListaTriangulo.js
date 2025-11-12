import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarTriangulo from "./BotonEliminarTriangulo.js";

const TablaTriangulo = ({ triangulos, eliminarTriangulo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Triángulos</Text>

      {/* Encabezado */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Base</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Altura</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Área</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Filas */}
      <ScrollView>
        {triangulos.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.base}</Text>
            <Text style={styles.celda}>{item.altura}</Text>
            <Text style={styles.celda}>
              {(item.base * item.altura / 2).toFixed(2)} cm²
            </Text>
            <View style={styles.celdaAcciones}>
              <BotonEliminarTriangulo id={item.id} eliminarTriangulo={eliminarTriangulo} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignSelf: "stretch" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  fila: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#CCC", paddingVertical: 6, alignItems: "center" },
  encabezado: { backgroundColor: "#f0f0f0" },
  celda: { flex: 1, fontSize: 16, textAlign: "center" },
  celdaAcciones: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  textoEncabezado: { fontWeight: "bold", fontSize: 17, textAlign: "center" },
});

export default TablaTriangulo