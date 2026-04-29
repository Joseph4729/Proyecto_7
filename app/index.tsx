import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import Logo from "./Logo.png";
import styles from "./styles/styles";

export default function App() {

 const [pantallaMapa, setPantallaMapa] = useState(false);
 const [MapComponents, setMapComponents] = useState<any>(null);

 useEffect(() => {
   if (typeof window !== "undefined") {

     import("react-leaflet").then((mod) => {
       setMapComponents({
         MapContainer: mod.MapContainer,
         TileLayer: mod.TileLayer,
         Marker: mod.Marker,
         Popup: mod.Popup
       });
     });

   }
 }, []);

 if (pantallaMapa) {

   return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Mapa de Bogotá
      </Text>

      <View style={styles.mapBox}>

       {MapComponents ? (
         <MapComponents.MapContainer
           center={[4.60971,-74.08175]}
           zoom={12}
           style={{height:"100%", width:"100%"}}
         >

          <MapComponents.TileLayer
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapComponents.Marker position={[4.60971,-74.08175]}>
             <MapComponents.Popup>
               Bogotá
             </MapComponents.Popup>
          </MapComponents.Marker>

         </MapComponents.MapContainer>

       ) : (
         <Text>Cargando mapa...</Text>
       )}

      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Ver ruta
        </Text>
      </TouchableOpacity>

    </View>
   );
 }

 return (
   <View style={styles.container}>

     <Text style={styles.title}>
       Bienvenido
     </Text>

     <Image source={Logo} style={styles.logo} />

     <TouchableOpacity
       style={styles.button}
       onPress={() => setPantallaMapa(true)}
     >
       <Text style={styles.buttonText}>
         Aceptar
       </Text>
     </TouchableOpacity>

   </View>
 );
}