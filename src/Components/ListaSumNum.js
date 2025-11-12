import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// El componente se llama ListaSumaNumeros para coincidir con tu estructura de archivos
const ListasumaNumeros = ({ sumas }) => {
  return (
    <View style={styles.container}>
      {/* Título adaptado al contexto de sumas */}
      <Text style={styles.titulo}>Documentos para Sumar</Text>
      <FlatList
        // La data ahora es 'sumas'
        data={sumas}
        // keyExtractor sigue usando item.id
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>
              {/* Mostramos el ID del documento y los campos num1 y num2 */}
              ID: {item.id.substring(0, 8)}... | Número 1: {item.num1} | Número 2: {item.num2}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center",
    paddingHorizontal: 10, // Añadido padding para mejor visualización
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center", // Centramos el título
  },
  itemContainer: { // Contenedor para cada elemento de la lista
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  item: { 
    fontSize: 16, 
    color: "#333",
  },
});

// Exportamos el componente con el nombre de archivo
export default ListasumaNumeros;