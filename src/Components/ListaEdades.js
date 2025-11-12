import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ListaEdades = ({ edades }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Edades</Text>
      <FlatList
        data={edades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.nombre} - Edad: {item.edad}
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

export default ListaEdades;
