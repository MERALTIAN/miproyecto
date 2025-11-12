import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ListaClientes = ({ clientes }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Clientes</Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.nombre} {item.apellido}  Cédula: {item.cedula}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: "center" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 18, marginBottom: 5 },
});

export default ListaClientes;