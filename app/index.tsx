import React, {
  useEffect,
  useState
} from "react";

import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import MapView, {
  Marker,
  Polyline
} from "react-native-maps";

import * as Location from "expo-location";

import Logo from "./Logo.png";
import rutas from "./rutas.json";
import styles from "./styles/styles";

export default function App() {

  const [pantallaMapa, setPantallaMapa] =
    useState(false);

  const [mapaRef, setMapaRef] =
    useState<any>(null);

  const [busqueda, setBusqueda] =
    useState("");

  const [rutaSeleccionada, setRutaSeleccionada] =
    useState<any>(null);

  const [rutaTransbordo, setRutaTransbordo] =
    useState<any>(null);

  const [ubicacionUsuario, setUbicacionUsuario] =
    useState<any>(null);

  const [origen, setOrigen] =
    useState("");

  const [destino, setDestino] =
    useState("");

  const [alternativas, setAlternativas] =
    useState<any[]>([]);

  // 🔎 BUSCADOR SIMPLE
  const resultados = rutas.features
    .filter((ruta: any) => {

      const nombre =
        ruta.properties.nom_ruta
          ?.toLowerCase() || "";

      const codigo =
        ruta.properties.cod_ruta
          ?.toLowerCase() || "";

      return (

        nombre.includes(
          busqueda.toLowerCase()
        ) ||

        codigo.includes(
          busqueda.toLowerCase()
        )

      );

    })
    .slice(0, 5);

  // 📍 GPS
  useEffect(() => {

    async function obtenerUbicacion() {

      try {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {

          alert(
            "Permiso de ubicación denegado"
          );

          return;

        }

        const location =
          await Location.getCurrentPositionAsync({

            accuracy:
              Location.Accuracy.High

          });

        setUbicacionUsuario({

          latitude:
            location.coords.latitude,

          longitude:
            location.coords.longitude

        });

      } catch (error) {

        console.log(
          "ERROR GPS:",
          error
        );

      }

    }

    obtenerUbicacion();

  }, []);

  // 🧹 LIMPIAR
  function limpiar(texto: any) {

    if (!texto) return "";

    return String(texto)
      .toLowerCase()
      .replace(/á/g, "a")
      .replace(/é/g, "e")
      .replace(/í/g, "i")
      .replace(/ó/g, "o")
      .replace(/ú/g, "u");

  }

  // 📏 DISTANCIA ENTRE 2 PUNTOS
  function distancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {

    return Math.sqrt(

      Math.pow(lat2 - lat1, 2) +

      Math.pow(lon2 - lon1, 2)

    );

  }

  // 📍 ÚLTIMO PUNTO
  function ultimoPunto(ruta: any) {

    const coords =

      ruta.geometry.type ===
      "MultiLineString"

        ? ruta.geometry.coordinates[0]

        : ruta.geometry.coordinates;

    return coords[
      coords.length - 1
    ];

  }

  // 📍 PRIMER PUNTO
  function primerPunto(ruta: any) {

    const coords =

      ruta.geometry.type ===
      "MultiLineString"

        ? ruta.geometry.coordinates[0]

        : ruta.geometry.coordinates;

    return coords[0];

  }

  // 🚍 BUSCAR VIAJE
  function buscarViaje() {

  if (!origen || !destino) {

    alert(
      "Ingresa origen y destino"
    );

    return;

  }

  const origenLimpio =
    limpiar(origen);

  const destinoLimpio =
    limpiar(destino);

  let rutasOrigen: any[] = [];

  let rutasDestino: any[] = [];

  let opciones: any[] = [];

  // 🔎 BUSCAR RUTAS RELACIONADAS
  rutas.features.forEach(
    (ruta: any) => {

      const texto = limpiar(

        `${ruta.properties.orig_ruta}
         ${ruta.properties.dest_ruta}
         ${ruta.properties.nom_ruta}
         ${ruta.properties.cod_ruta}`

      );

      // ORIGEN
      if (
        texto.includes(
          origenLimpio
        )
      ) {

        rutasOrigen.push(ruta);

      }

      // DESTINO
      if (
        texto.includes(
          destinoLimpio
        )
      ) {

        rutasDestino.push(ruta);

      }

    }
  );

  // ✅ RUTAS DIRECTAS
  rutasOrigen.forEach(
    (rutaA: any) => {

      rutasDestino.forEach(
        (rutaB: any) => {

          if (

            rutaA.properties.cod_ruta ===
            rutaB.properties.cod_ruta

          ) {

            opciones.push({

              tipo:
                "Ruta Directa",

              transbordos: 0,

              ruta1: rutaA,

              ruta2: null,

              origen,

              destino

            });

          }

        }
      );

    }
  );

  // 🔁 TRANSBORDOS FLEXIBLES
  rutasOrigen.forEach(
    (rutaA: any) => {

      rutasDestino.forEach(
        (rutaB: any) => {

          // evitar misma ruta
          if (

            rutaA.properties.cod_ruta !==
            rutaB.properties.cod_ruta

          ) {

            opciones.push({

              tipo:
                "Ruta con Transbordo",

              transbordos: 1,

              ruta1: rutaA,

              ruta2: rutaB,

              origen,

              destino

            });

          }

        }
      );

    }
  );

  // 🚫 SIN RESULTADOS
  if (opciones.length === 0) {

    alert(
      "No se encontraron rutas"
    );

    setAlternativas([]);

    return;

  }

  // 🚫 ELIMINAR DUPLICADOS
  const opcionesUnicas =
    opciones.filter(
      (
        opcion,
        index,
        self
      ) =>

        index ===
        self.findIndex(
          (o) =>

            o.ruta1.properties.cod_ruta ===
            opcion.ruta1.properties.cod_ruta &&

            o.ruta2?.properties
              ?.cod_ruta ===

            opcion.ruta2?.properties
              ?.cod_ruta
        )
    );

  // ✅ LIMITAR OPCIONES
  const finales =
    opcionesUnicas.slice(0, 5);

  setAlternativas(finales);

  // 🔵 MOSTRAR PRIMERA
  setRutaSeleccionada(
    finales[0].ruta1
  );

  setRutaTransbordo(
    finales[0].ruta2
  );

}

  // 📍 IR A GPS
  function irAMiUbicacion() {

    if (
      mapaRef &&
      ubicacionUsuario
    ) {

      mapaRef.animateToRegion({

        latitude:
          ubicacionUsuario.latitude,

        longitude:
          ubicacionUsuario.longitude,

        latitudeDelta: 0.02,
        longitudeDelta: 0.02

      });

    }

  }

  // 🗺️ MAPA
  if (pantallaMapa) {

    return (

      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
      >

        <Text style={styles.title}>
          Map Piece
        </Text>

        {/* 🔎 BUSCAR */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ruta..."
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {/* 📋 RESULTADOS */}
        {busqueda.length > 0 && (

          <View style={styles.resultsBox}>

            {resultados.map(
              (item: any, index) => (

                <TouchableOpacity

                  key={index}

                  style={
                    styles.resultItem
                  }

                  onPress={() => {

                    setBusqueda(

                      `${item.properties.cod_ruta} - ${item.properties.nom_ruta}`

                    );

                    setRutaSeleccionada(
                      item
                    );

                    setRutaTransbordo(
                      null
                    );

                  }}
                >

                  <Text>

                    {
                      item.properties
                        .cod_ruta
                    }

                    {" - "}

                    {
                      item.properties
                        .nom_ruta
                    }

                  </Text>

                </TouchableOpacity>

              )
            )}

          </View>

        )}

        {/* 📍 ORIGEN */}
        <TextInput
          style={styles.searchInput}
          placeholder="Origen"
          value={origen}
          onChangeText={setOrigen}
        />

        {/* 🏁 DESTINO */}
        <TextInput
          style={styles.searchInput}
          placeholder="Destino"
          value={destino}
          onChangeText={setDestino}
        />

        {/* 🔎 BOTÓN */}
        <TouchableOpacity

          style={styles.button}

          onPress={buscarViaje}

        >

          <Text style={styles.buttonText}>
            Buscar viaje
          </Text>

        </TouchableOpacity>

        {/* 🗺️ MAPA */}
        <View
          style={{
            width: "95%",
            height: 650,
            marginTop: 15,
            borderRadius: 20,
            overflow: "hidden"
          }}
        >

          <MapView

            ref={(ref) =>
              setMapaRef(ref)
            }

            style={{
              width: "100%",
              height: "100%"
            }}

            initialRegion={{

              latitude:
                ubicacionUsuario
                  ?.latitude || 4.60971,

              longitude:
                ubicacionUsuario
                  ?.longitude || -74.08175,

              latitudeDelta: 0.05,
              longitudeDelta: 0.05

            }}

            showsUserLocation={true}

          >

            {/* 📍 GPS */}
            {ubicacionUsuario && (

              <Marker

                coordinate={{

                  latitude:
                    ubicacionUsuario.latitude,

                  longitude:
                    ubicacionUsuario.longitude

                }}

                title="Mi ubicación"

              />

            )}

            {/* 🔵 RUTA 1 */}
            {rutaSeleccionada?.geometry
              ?.coordinates && (

              <Polyline

                coordinates={

                  (
                    rutaSeleccionada.geometry
                      .type ===
                    "MultiLineString"

                      ? rutaSeleccionada.geometry
                          .coordinates[0]

                      : rutaSeleccionada.geometry
                          .coordinates

                  ).map(
                    (coord: any) => ({

                      latitude:
                        coord[1],

                      longitude:
                        coord[0]

                    })
                  )

                }

                strokeColor="blue"

                strokeWidth={5}

              />

            )}

            {/* 🔴 RUTA 2 */}
            {rutaTransbordo?.geometry
              ?.coordinates && (

              <Polyline

                coordinates={

                  (
                    rutaTransbordo.geometry
                      .type ===
                    "MultiLineString"

                      ? rutaTransbordo.geometry
                          .coordinates[0]

                      : rutaTransbordo.geometry
                          .coordinates

                  ).map(
                    (coord: any) => ({

                      latitude:
                        coord[1],

                      longitude:
                        coord[0]

                    })
                  )

                }

                strokeColor="red"

                strokeWidth={5}

              />

            )}

          </MapView>

          {/* 📍 BOTÓN */}
          <TouchableOpacity

            style={
              styles.floatingButton
            }

            onPress={
              irAMiUbicacion
            }

          >

            <Text
              style={
                styles.floatingText
              }
            >

              📍

            </Text>

          </TouchableOpacity>

        </View>

        {/* 🚍 OPCIONES */}
        {alternativas.map(
          (alternativa: any, index) => (

            <TouchableOpacity

              key={index}

              style={styles.resultsBox}

              onPress={() => {

                setRutaSeleccionada(
                  alternativa.ruta1
                );

                setRutaTransbordo(
                  alternativa.ruta2
                );

              }}

            >

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16
                }}
              >

                🚍 {alternativa.tipo}

              </Text>

              <Text>

                📍 {alternativa.origen}

              </Text>

              <Text>

                🏁 {alternativa.destino}

              </Text>

              <Text>

                🔄 {alternativa.transbordos}
                {" "}
                transbordo(s)

              </Text>

              <Text>

                🔵 {
                  alternativa.ruta1
                    ?.properties
                    ?.cod_ruta
                }

              </Text>

              {alternativa.ruta2 && (

                <Text>

                  🔴 {
                    alternativa.ruta2
                      ?.properties
                      ?.cod_ruta
                  }

                </Text>

              )}

            </TouchableOpacity>

          )
        )}

      </ScrollView>

    );

  }

  // 🏠 INICIO
  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Bienvenido
      </Text>

      <Image
        source={Logo}
        style={styles.logo}
      />

      <TouchableOpacity

        style={styles.button}

        onPress={() =>
          setPantallaMapa(true)
        }

      >

        <Text style={styles.buttonText}>
          Ingresar
        </Text>

      </TouchableOpacity>

    </View>

  );

}