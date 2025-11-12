import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// IMPORTANTE: Asegúrate de que el nombre del archivo sea correcto, 
// o renuévalo en tu proyecto si usaste "BotonEliminarUsuario.js"
import BotonEliminarUsuario from "./BotonEliminarUsuario.js"; 

// Se han renombrado las props: 'productos' a 'usuarios', 
// 'eliminarProducto' a 'eliminarUsuario', 'editarProducto' a 'editarUsuario'.
const TablaUsuarios = ({ usuarios, eliminarUsuario, editarUsuario }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Usuarios</Text>

      {/* Encabezado de la tabla, ajustado a los campos de la imagen */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celdaNombre, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celdaCorreo, styles.textoEncabezado]}>Correo</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Edad</Text>
        <Text style={[styles.celdaAcciones, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido de la tabla */}
      <ScrollView>
        {usuarios.map((item) => (
          <View key={item.id} style={styles.fila}>
            {/* Muestra el nombre */}
            <Text style={styles.celdaNombre}>{item.nombre}</Text>
            
            {/* Muestra el correo */}
            <Text style={styles.celdaCorreo} numberOfLines={1}>{item.correo}</Text>
            
            {/* Muestra la edad */}
            <Text style={styles.celda}>{item.edad}</Text>
            
            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.botonEditar}
                // Llama a la función 'editarUsuario'
                onPress={() => editarUsuario(item)}
              >
                <Text style={styles.textoBotonEditar}>🖋️</Text>
              </TouchableOpacity>
              
              {/* Usando el componente adaptado BotonEliminarUsuario */}
              <BotonEliminarUsuario
                id={item.id}
                // Pasa la función 'eliminarUsuario'
                eliminarUsuario={eliminarUsuario}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10 ,
    alignSelf: "stretch",
  },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#CCC",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f0f0f0",
  },
  // Celda genérica para edad/acciones
  celda: {
    flex: 0.5, // Le doy menos peso para darle más al nombre y correo
    fontSize: 14,
    textAlign: "center",
  },
  // Celda específica para Nombre
  celdaNombre: {
    flex: 1.5,
    fontSize: 14,
    textAlign: "center",
  },
  // Celda específica para Correo (necesita más espacio)
  celdaCorreo: {
    flex: 2,
    fontSize: 14,
    textAlign: "center",
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 15, // Un poco más pequeño para caber en la tabla
    textAlign: "center",
  },
  botonEditar: {
    backgroundColor: "#828385ff", // Cambié el color para que sea más visible
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  textoBotonEditar: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TablaUsuarios;