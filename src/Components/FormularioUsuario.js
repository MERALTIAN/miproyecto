import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

// He renombrado la prop 'nuevoProducto' a 'nuevoUsuario' para reflejar el nuevo contexto
const FormularioUsuario = ({ nuevoUsuario, manejoCambio, guardarUsuario, actualizarUsuario, modoEdicion }) => {
  return (
    <View style={styles.container}>
      {/* El título se adapta para "Registro de Usuarios" o "Editar Usuario" */}
      <Text style={styles.titulo}>{modoEdicion ? "Editar Usuario" : "Registro de Usuarios"}</Text>

      {/* Campo para el Nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        // Ahora usa nuevoUsuario.nombre
        value={nuevoUsuario.nombre}
        onChangeText={(text) => manejoCambio('nombre', text)}
      />

      {/* Campo para el Correo (Email) */}
      <TextInput
        style={styles.input}
        placeholder="Correo (ejemplo@gmail.com)"
        // Ahora usa nuevoUsuario.correo
        value={nuevoUsuario.correo}
        onChangeText={(text) => manejoCambio('correo', text)}
        // Tipo de teclado apropiado para correos electrónicos
        keyboardType="email-address"
        autoCapitalize="none" // Para evitar mayúsculas automáticas en emails
      />

      {/* Campo para la Edad */}
      <TextInput
        style={styles.input}
        placeholder="Edad"
        // Ahora usa nuevoUsuario.edad
        value={nuevoUsuario.edad}
        onChangeText={(text) => manejoCambio('edad', text)}
        // Solo permite números para la edad
        keyboardType="numeric"
      />

      {/* Campo para el Teléfono */}
      <TextInput
        style={styles.input}
        placeholder="Teléfono (Ej: 50512345678)"
        // Ahora usa nuevoUsuario.telefono
        value={nuevoUsuario.telefono}
        onChangeText={(text) => manejoCambio('telefono', text)}
        // Tipo de teclado apropiado para números de teléfono
        keyboardType="phone-pad"
      />

      {/* Botón de acción */}
      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        // Las funciones ahora deben ser guardarUsuario/actualizarUsuario
        onPress={modoEdicion ? actualizarUsuario : guardarUsuario}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10 },
});

export default FormularioUsuario;