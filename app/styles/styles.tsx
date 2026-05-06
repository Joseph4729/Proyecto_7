import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "flex-start", // 👈 antes estaba centrado
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
    resizeMode: "contain"
  },

  mapBox: {
    width: "90%",
    height: "70%",  // 👈 ocupa la mayor parte de la pantalla
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20
  },

  map: {
    width: "100%",
    height: "100%"
  },

  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  searchInput: {
  width: "92%",
  height: 45,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  paddingHorizontal: 15,
  backgroundColor: "white",
  marginBottom: 10
},

resultsBox: {
  width: "92%",
  backgroundColor: "white",
  borderRadius: 10,
  marginBottom: 10,
  maxHeight: 180
},

resultItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#eee"
},

scrollContainer: {
  flexGrow: 1,
  alignItems: "center",
  paddingBottom: 40
},

floatingButton: {
  position: "absolute",
  bottom: 20,
  right: 20,
  backgroundColor: "#4285F4",
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 30,
  zIndex: 999
},

floatingText: {
  color: "white",
  fontWeight: "bold"
},

});