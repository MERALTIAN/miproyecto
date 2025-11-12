import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

// He renombrado las props y el componente para reflejar la eliminación de un usuario
const BotonEliminarUsuario = ({ id, eliminarUsuario }) => {
  const [visible, setVisible] = useState(false);

  const confirmarEliminar = () => {
    setVisible(false);
    // Llama a la función eliminarUsuario (antes eliminarProducto)
    eliminarUsuario(id);
  };

  return (
    <View>
      {/* Botón pequeño */}
      <TouchableOpacity
        style={styles.boton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.textoBoton}>🗑️</Text>
      </TouchableOpacity>

      {/* Modal de confirmación */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Texto adaptado para preguntar por el usuario */}
            <Text style={styles.texto}>¿Desea eliminar este usuario?</Text>

            <View style={styles.fila}>
              <TouchableOpacity
                style={[styles.botonAccion, styles.cancelar]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.textoAccion}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botonAccion, styles.confirmar]}
                onPress={confirmarEliminar}
              >
                <Text style={styles.textoAccion}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  boton: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#f3f3f7ff", // He cambiado el color a uno más neutro si el anterior era invisible con el tacho
  },
  // Tu texto del botón era "white" lo cual no se vería bien con el fondo,
  // pero mantengo el color del texto para el ícono si quieres cambiarlo en el futuro
  textoBoton: { color: "black", fontSize: 14 }, 
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  texto: { fontSize: 18, marginBottom: 20 },
  fila: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  botonAccion: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelar: { backgroundColor: "#ccc" },
  confirmar: { backgroundColor: "#e63946" },
  textoAccion: { color: "white", fontWeight: "bold" },
});

export default BotonEliminarUsuario;