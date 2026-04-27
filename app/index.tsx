import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import Logo from "./Logo.png";
import styles from "./styles/styles";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenido
      </Text>

      <Image
        source={Logo}
        style={styles.logo}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Ingresar
        </Text>
      </TouchableOpacity>
    </View>
  );
}