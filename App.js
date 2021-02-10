import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import mime from "mime";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  let camera = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const createFormData = (photo, body) => {
    const data = new FormData();
    const imageUri = "file:///" + photo.uri.split("file:/").join("");
    data.append("photo", {
      name: imageUri.split("/").pop(),
      type: mime.getType(imageUri),
      uri: imageUri,
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

  const snap = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      fetch("https://image-url-2021.herokuapp.com/api/upload", {
        method: "POST",
        body: createFormData(photo, { userId: "123" }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("upload success", response);
          alert("Upload success!");
        })
        .catch((error) => {
          console.log("upload error", error);
          alert("Upload failed!");
        });
    }
  };

  return (
    <View style={styles.container}>
      <Camera ref={(ref) => (camera = ref)} style={styles.camera}>
        <View style={styles.buttonContainer} />
      </Camera>
      <TouchableOpacity
        style={styles.redButton}
        onPress={snap}
      ></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: 300,
    height: 200,
    backgroundColor: "green",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  redButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "red",
  },
});
