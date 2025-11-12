import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebaseconfig";

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const manejarLogin = async () => {
    if (!email || !password) {
        Alert.alert("Error", "Por favor completa ambos campos.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess(); // Notifica al componente App que el login fue exitoso
    } catch (error) {
        // Mejor logging para diagnóstico
        console.error('Firebase login error:', error.code, error.message, error);
        let mensaje = "Error al iniciar sesión.";

        if (error.code === "auth/invalid-email") {
            mensaje = "Correo inválido.";
        }

        if (error.code === "auth/user-not-found") {
            mensaje = "Usuario no encontrado.";
        }

        if (error.code === "auth/wrong-password") {
            mensaje = "Contraseña incorrecta.";
        }

        // Manejar credenciales inválidas (p. ej. token o petición malformada)
        if (error.code === "auth/invalid-credential") {
            mensaje = "Credenciales inválidas. Verifica email/contraseña y que el proyecto de Firebase esté correctamente configurado.";
        }

        Alert.alert("Error", mensaje);
    }
};

// Función de diagnóstico: intenta crear un usuario con el email/password ingresados
const manejarCrearUsuarioPrueba = async () => {
    if (!email || !password) {
        Alert.alert("Error", "Por favor completa ambos campos para crear el usuario de prueba.");
        return;
    }

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuario de prueba creado:', userCred.user.uid, userCred);
        Alert.alert('Éxito', 'Usuario de prueba creado. Ahora intenta iniciar sesión.');
    } catch (error) {
        console.error('Firebase createUser error:', error.code, error.message, error);
        let mensaje = 'Error al crear usuario de prueba.';
        if (error.code === 'auth/email-already-in-use') mensaje = 'El correo ya está en uso.';
        if (error.code === 'auth/invalid-email') mensaje = 'Correo inválido.';
        if (error.code === 'auth/weak-password') mensaje = 'La contraseña es demasiado débil.';
        if (error.code === 'auth/invalid-credential') mensaje = 'Credencial inválida. Revisa la configuración de Firebase.';
        Alert.alert('Error', mensaje);
    }
};

return (
    <View style={styles.container}>
        <Text style={styles.titulo}>Iniciar Sesión</Text>
        <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />

        <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />

        <TouchableOpacity style={styles.boton} onPress={manejarLogin}>
            <Text style={styles.textoBoton}>Entrar</Text>
        </TouchableOpacity>
    </View>
);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "white",
    },
    boton: {
        backgroundColor: "#2196F3",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    textoBoton: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Login;