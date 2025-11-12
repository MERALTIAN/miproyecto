import React, { useEffect, useState } from "react";
// Agregamos Alert para mostrar los mensajes del backend
import { View, StyleSheet, Alert } from "react-native"; 
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
// Importamos los componentes que adaptaste previamente
import FormularioUsuario from "../Components/FormularioUsuario.js"; 
import TablaUsuarios from "../Components/TablaUsuarios.js";

// 1. Función de validación con el servicio AWS Lambda (fuera del componente para evitar recreación)
const validarDatos = async (datos) => {
    try {
        const response = await fetch("https://wc5mcx54pj.execute-api.us-east-2.amazonaws.com/validarusuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        const resultado = await response.json();

        if (resultado.success) {
            return resultado.data; // Datos limpios y validados
        } else {
            // Muestra una alerta con los errores del backend
            Alert.alert("Errores en los datos", resultado.errors.join("\n"));
            return null;
        }
    } catch (error) {
        console.error("Error al validar con Lambda:", error);
        Alert.alert("Error", "No se pudo validar la información con el servidor.");
        return null;
    }
};

// El componente principal se llama Usuarios
const Usuarios = () => {
    // 2. Estados iniciales (sin cambios)
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({ 
        nombre: "", 
        correo: "",
        edad: "", 
        telefono: "" 
    });
    const [idUsuario, setIdUsuario] = useState(null); 
    const [modoEdicion, setModoEdicion] = useState(false);

    // 3. Función para cargar todos los datos (sin cambios)
    const cargarDatos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                // Aseguramos que edad y telefono sean strings para el input
                edad: doc.data().edad.toString(),
                telefono: doc.data().telefono.toString(),
            }));
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener documentos (usuarios):", error);
        }
    };

    // 4. Función para eliminar un usuario (sin cambios)
    const eliminarUsuario = async (id) => {
        try {
            await deleteDoc(doc(db, "usuarios", id));
            cargarDatos();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    // 5. Función genérica para manejar los cambios (sin cambios)
    const manejoCambio = (campo, valor) => {
        setNuevoUsuario((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };
    
    // **6. NUEVA FUNCIÓN para guardar un nuevo usuario (con validación)**
    const guardarUsuario = async () => {
        // Llama al servicio de validación
        const datosValidados = await validarDatos(nuevoUsuario);

        if (datosValidados) {
            try {
                // Usa los datos LIMPIOS y VALIDADOS por el backend
                await addDoc(collection(db, "usuarios"), {
                    nombre: datosValidados.nombre,
                    correo: datosValidados.correo,
                    telefono: parseInt(datosValidados.telefono),
                    edad: parseInt(datosValidados.edad),
                });
                
                // Limpiar formulario y recargar
                setNuevoUsuario({ nombre: "", correo: "", telefono: "", edad: "" });
                cargarDatos();
                Alert.alert("Éxito", "Usuario registrado correctamente.");
            } catch (error) {
                console.error("Error al registrar usuario:", error);
            }
        }
    };

    // **7. NUEVA FUNCIÓN para actualizar un usuario existente (con validación)**
    const actualizarUsuario = async () => {
        // Llama al servicio de validación
        const datosValidados = await validarDatos(nuevoUsuario);

        // Verifica que los datos sean válidos y que estemos en modo edición
        if (datosValidados && idUsuario) {
            try {
                // Usa los datos LIMPIOS y VALIDADOS por el backend
                await updateDoc(doc(db, "usuarios", idUsuario), {
                    nombre: datosValidados.nombre,
                    correo: datosValidados.correo,
                    telefono: parseInt(datosValidados.telefono),
                    edad: parseInt(datosValidados.edad),
                });
                
                // Limpiar formulario, salir de edición y recargar
                setNuevoUsuario({ nombre: "", correo: "", telefono: "", edad: "" });
                setModoEdicion(false);
                setIdUsuario(null);
                cargarDatos();
                Alert.alert("Éxito", "Usuario actualizado correctamente.");
            } catch (error) {
                console.error("Error al actualizar usuario:", error);
            }
        }
    };

    // 8. Función para entrar en modo edición (sin cambios)
    const editarUsuario = (usuario) => {
        setNuevoUsuario({ 
            nombre: usuario.nombre, 
            correo: usuario.correo, 
            edad: usuario.edad, 
            telefono: usuario.telefono, 
        });
        setIdUsuario(usuario.id);
        setModoEdicion(true);
    };

    // 9. Cargar datos al montar el componente (sin cambios)
    useEffect(() => {
        cargarDatos();
    }, []);

    // 10. Renderizado (sin cambios)
    return (
        <View style={styles.container}>
            <FormularioUsuario 
                nuevoUsuario={nuevoUsuario}
                manejoCambio={manejoCambio}
                guardarUsuario={guardarUsuario}
                actualizarUsuario={actualizarUsuario}
                modoEdicion={modoEdicion}
            />
            <TablaUsuarios
                usuarios={usuarios}
                eliminarUsuario={eliminarUsuario}
                editarUsuario={editarUsuario}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 2.7, padding: 20 },
});

export default Usuarios;