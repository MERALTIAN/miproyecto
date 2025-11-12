import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from "react-native";

// Importaciones de Firebase Database
import { ref, set, push, onValue } from "firebase/database";
// Asegúrate de que esta ruta sea correcta para tu proyecto
import { realtimeDB } from "../database/firebaseconfig"; 

// --- Componente principal ---

const CalculadoraIMC = () => {
  // Estados para los inputs del cálculo
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState(""); // En kg
  const [altura, setAltura] = useState(""); // En metros
  const [registrosIMC, setRegistrosIMC] = useState([]); // Lista de registros guardados

  // Función auxiliar para clasificar el IMC
  const clasificarIMC = (imc) => {
    if (imc < 18.5) return "Bajo Peso 🔴";
    if (imc >= 18.5 && imc < 25) return "Normal ✅";
    if (imc >= 25 && imc < 30) return "Sobrepeso 🟠";
    if (imc >= 30) return "Obesidad 🛑";
    return "Inválido";
  };

  // Función para calcular y guardar el registro
  const calcularYGuardarIMC = async () => {
    // 1. Validar inputs
    if (!nombre || !peso || !altura) {
      Alert.alert("Error", "Rellena el nombre, peso y altura.");
      return;
    }

    const pesoNum = Number(peso);
    const alturaNum = Number(altura);

    // Validación crucial para evitar el error "IMC: 0" o "IMC: NaN"
    if (isNaN(pesoNum) || isNaN(alturaNum) || pesoNum <= 0 || alturaNum <= 0) {
      Alert.alert("Error", "El peso y la altura deben ser números positivos válidos.");
      return;
    }
    
    // 2. Calcular IMC (Peso / Altura^2)
    const imc = (pesoNum / (alturaNum * alturaNum)).toFixed(2);
    const clasificacion = clasificarIMC(parseFloat(imc));
    
    // 3. Preparar datos para Firebase
    const registro = {
      nombre,
      peso: pesoNum,
      altura: alturaNum,
      imc: parseFloat(imc),
      clasificacion,
      fecha: new Date().toLocaleDateString()
    };

    // 4. Guardar en Firebase
    try {
      const referencia = ref(realtimeDB, "registros_imc");
      const nuevoRef = push(referencia); 

      await set(nuevoRef, registro);

      // 5. Limpiar inputs
      setNombre("");
      setPeso("");
      setAltura("");
      
      Alert.alert("Éxito", `IMC calculado y guardado: ${imc} (${clasificacion})`);
    } catch (error) {
      console.log("Error al guardar:", error);
      Alert.alert("Error de guardado", "No se pudo conectar con la base de datos.");
    }
  };

  // Función para leer registros en tiempo real
  const leerRegistrosRT = () => {
    const registrosRef = ref(realtimeDB, "registros_imc");

    const unsubscribe = onValue(registrosRef, (snapshot) => {
      const data = snapshot.val();
      const registrosArray = [];

      if (data) {
        Object.keys(data).forEach((key) => {
          registrosArray.push({
            id: key, 
            ...data[key]
          });
        });
        // Mostrar los más recientes primero
        setRegistrosIMC(registrosArray.reverse()); 
      } else {
        setRegistrosIMC([]);
      }
    });
    
    return unsubscribe; // Devuelve la función para detener el listener
  };

  // Usar useEffect para iniciar la lectura y limpiar el listener al desmontar
  useEffect(() => {
    const unsubscribe = leerRegistrosRT();
    return () => {
        // Detiene la escucha de la base de datos al salir del componente
        unsubscribe();
    };
  }, []);


  // --- Renderizado del Componente ---

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Calculadora de IMC y Registro</Text>

      {/* Inputs para el cálculo */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Altura (metros, ej: 1.75)"
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
      />

      <Button 
        title="Calcular y Guardar IMC" 
        onPress={calcularYGuardarIMC} 
      />

      {/* Listado de Registros Anteriores */}
      <Text style={styles.subtitulo}>Historial de Registros:</Text>

      {registrosIMC.length === 0 ? (
        <Text style={styles.noDataText}>No hay registros guardados.</Text>
      ) : (
        registrosIMC.map((r) => (
          <View key={r.id} style={styles.registroItem}>
            <Text style={styles.itemText}><Text style={styles.bold}>Nombre:</Text> {r.nombre}</Text>
            <Text style={styles.itemText}><Text style={styles.bold}>Peso/Altura:</Text> {r.peso} kg / {r.altura} m</Text>
            <Text style={[styles.itemText, styles.imcResult]}><Text style={styles.bold}>IMC:</Text> {r.imc} - {r.clasificacion}</Text>
            <Text style={styles.dateText}>Registrado el: {r.fecha}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// --- Estilos ---

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    marginTop: 50,
    backgroundColor: '#f9f9f9',
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  subtitulo: { 
    fontSize: 18, 
    marginTop: 30, 
    marginBottom: 10,
    fontWeight: "bold",
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  registroItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
  },
  bold: {
      fontWeight: 'bold',
  },
  imcResult: {
      fontWeight: 'bold',
      marginTop: 5,
  },
  dateText: {
      fontSize: 12,
      color: '#888',
      marginTop: 5,
      textAlign: 'right'
  },
  noDataText: {
      textAlign: 'center',
      marginTop: 15,
      color: '#999'
  }
});

export default CalculadoraIMC;