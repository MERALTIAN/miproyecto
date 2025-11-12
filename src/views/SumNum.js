import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import TitulosumaNumeros from "../Components/TitulosumNumeros.js";
import FormularioSumaNumeros from "../Components/FormulariosumaNumeros.js";
import TablasumaNumeros from "../Components/TablasumaNumeros.js";

const SumaNumeros = () => {
  const [sumas, setSumas] = useState([]);
  const [resultado, setResultado] = useState(null);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "sumas"));
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setSumas(data);

      if (data.length > 0) {
        calcularSumaAPI(data);
      } else {
        setResultado(null);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const calcularSumaAPI = async (lista) => {
    try {
      // Depuración: Verificar los datos antes de mapear
      console.log("Datos recibidos en calcularSumaAPI:", lista);

      // Extraer los resultados de cada suma (num1 + num2), asegurando que sean números
      const numeros = lista.map((item) => {
        const num1 = Number(item.num1) || 0;
        const num2 = Number(item.num2) || 0;
        return num1 + num2;
      });

      console.log("Números calculados (resultados individuales):", numeros);

      // Calcular la suma total localmente (esto es lo que quieres mostrar arriba)
      const sumaTotalLocal = numeros.reduce((acc, num) => acc + num, 0);
      console.log("Suma total calculada localmente:", sumaTotalLocal);

      // Intentar con la API: Enviar solo los dos primeros como objeto {num1, num2}
      if (numeros.length >= 2) {
        const payload = {
          num1: numeros[0],  // Primer resultado (ej. 80)
          num2: numeros[1],  // Segundo resultado (ej. 100)
        };

        console.log("Payload enviado a la API (dos números):", payload);

        const response = await fetch(
          "https://azwu698p32.execute-api.us-east-2.amazonaws.com/suma-numeros",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),  // Enviar como {num1: 80, num2: 100}
          }
        );

        const data = await response.json();
        console.log("Respuesta de la API:", data);

        // Si la API responde bien, usa su resultado; si no, usa el local
        if (data.resultado !== undefined && !data.error) {
          setResultado(data.resultado);
        } else {
          console.log("API falló, usando suma local como fallback");
          setResultado(sumaTotalLocal);
        }
      } else {
        // Si hay menos de 2, usa el local
        setResultado(sumaTotalLocal);
      }
    } catch (error) {
      console.error("Error al calcular suma en API:", error);
      // Fallback: Calcular localmente si la API falla
      const numeros = lista.map((item) => (Number(item.num1) || 0) + (Number(item.num2) || 0));
      const sumaTotalLocal = numeros.reduce((acc, num) => acc + num, 0);
      setResultado(sumaTotalLocal);
    }
  };

  const eliminarSuma = async (id) => {
    try {
      await deleteDoc(doc(db, "sumas", id));
      cargarDatos(); // recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TitulosumaNumeros resultado={resultado} />
      <FormularioSumaNumeros cargarDatos={cargarDatos} />
      <TablasumaNumeros sumas={sumas} eliminarSuma={eliminarSuma} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 2.7, padding: 20 },
});

export default SumaNumeros;