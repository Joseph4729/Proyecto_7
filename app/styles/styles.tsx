import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
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
    width: 600,
    height: 500,
    borderWidth: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30
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
  }

});