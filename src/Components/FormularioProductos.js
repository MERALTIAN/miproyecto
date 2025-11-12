import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

const FormularioProductos = ({ nuevoProducto, manejoCambio, guardarProducto, actualizarProducto, modoEdicion }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{modoEdicion ? "Editar Producto" : "Registro de Productos"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nuevoProducto.nombre}
        onChangeText={(text) => manejoCambio('nombre', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={nuevoProducto.precio}
        onChangeText={(text) => manejoCambio('precio', text)}
        keyboardType="numeric"
      />

      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarProducto : guardarProducto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10 },
});

export default FormularioProductos;