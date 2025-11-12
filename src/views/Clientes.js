import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import FormularioClientes from "../Components/FormularioClientes.js";
import TablaClientes from "../Components/TablaClientes.js"; // Corregido el nombre del archivo

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", apellido: "", cedula: "" });
  const [idCliente, setIdCliente] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const manejoCambio = (campo, valor) => {
    setNuevoCliente((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarCliente = async () => {
    if (nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.cedula) {
      try {
        await addDoc(collection(db, "clientes"), {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          cedula: nuevoCliente.cedula,
        });
        setNuevoCliente({ nombre: "", apellido: "", cedula: "" });
        cargarDatos();
      } catch (error) {
        console.error("Error al registrar cliente:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const actualizarCliente = async () => {
    if (nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.cedula && idCliente) {
      try {
        await updateDoc(doc(db, "clientes", idCliente), {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          cedula: nuevoCliente.cedula,
        });
        setNuevoCliente({ nombre: "", apellido: "", cedula: "" });
        setIdCliente(null);
        setModoEdicion(false);
        cargarDatos();
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const editarCliente = (cliente) => {
    setNuevoCliente({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      cedula: cliente.cedula,
    });
    setIdCliente(cliente.id);
    setModoEdicion(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioClientes
        nuevoCliente={nuevoCliente}
        manejoCambio={manejoCambio}
        guardarCliente={guardarCliente}
        actualizarCliente={actualizarCliente}
        modoEdicion={modoEdicion}
      />
      <TablaClientes
        clientes={clientes}
        eliminarCliente={eliminarCliente}
        editarCliente={editarCliente}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2, padding: 20 },
});

export default Clientes;