import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuthentication } from '../hooks/useAuthentication';
import { fetchBorderData } from '../Components/LandBorders'; // Adjust the path as necessary

export default function Maps({ navigation, route }) {
  const { logout } = useAuthentication();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapType, setMapType] = useState('standard'); // State for map type
  const [polygonCoords, setPolygonCoords] = useState([]); // State for polygon coordinates
  const [pinLocation, setPinLocation] = useState(null); // State for blue pin location
  const mapRef = useRef(null);

  const initialRegion = {
    latitude: 34.020882,  
    longitude: -6.841650,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Function to calculate the centroid of the polygon
  const calculateCentroid = (coordinates) => {
    let latSum = 0;
    let lonSum = 0;
    coordinates.forEach(coord => {
      latSum += coord.latitude;
      lonSum += coord.longitude;
    });
    const length = coordinates.length;
    return {
      latitude: latSum / length,
      longitude: lonSum / length,
    };
  };

  useEffect(() => {
    if (route.params?.refresh) {
      // Keep the current map type
      setPolygonCoords([]);
      setPinLocation(null); // Reset the pin location
      mapRef.current?.animateToRegion(initialRegion, 1000);
      navigation.setParams({ refresh: false }); // Reset refresh flag
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      if (coords) {
        setLocation(coords);
      } else {
        setErrorMsg('Could not fetch location');
      }
    })();

    if (route.params?.latitude && route.params?.longitude) {
      mapRef.current.animateToRegion({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);

      fetchBorderData(route.params.positionId).then(data => {
        setPolygonCoords(data);
        setPinLocation(calculateCentroid(data)); // Set the blue pin at the centroid
      });
    }
  }, [route.params?.latitude, route.params?.longitude, route.params?.positionId]);

  const handleLocateUser = async () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } else {
      Alert.alert('Error', 'Unable to fetch location');
    }
  };

  const handleToggleMapType = () => {
    setMapType(prevType => (prevType === 'standard' ? 'satellite' : 'standard'));
  };

  const handleLogout = () => {
    logout(navigation);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        mapType={mapType} // Set the map type
        showsUserLocation={true}
        followUserLocation={true}
        showsMyLocationButton={false}
      >
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="My Location"
            description="This is your current location"
          />
        )}
        {polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            strokeColor="#fffb00"
            fillColor="rgba(255,251,0,0.25)"
            strokeWidth={3}
          />
        )}
        {pinLocation && (
          <Marker
            coordinate={pinLocation}
            pinColor="blue"
            title="Polygon Center"
            description="Center of the polygon"
          />
        )}
      </MapView>
      <View style={styles.header}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={25} color="white" />
        </Pressable>
        <Text style={styles.title}>Maps</Text>
        <Pressable style={styles.locateButton} onPress={handleLocateUser}>
          <MaterialIcons name="my-location" size={25} color="white" />
        </Pressable>
        <Pressable style={styles.mapTypeButton} onPress={handleToggleMapType}>
          <MaterialIcons name="layers" size={25} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Make the map fill the entire screen
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingHorizontal: 15,
    backgroundColor: "#388e3c",
    borderRadius: 20,
    height: 40,
    position: 'absolute',
    top: 30, 
    left: 15,
    right: 15,
    zIndex: 1, 
    marginTop: 20, 
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
  logoutButton: {
    padding: 10,
    position: "absolute",
    left: 10,
    zIndex: 1, 
  },
  locateButton: {
    padding: 10,
    position: "absolute",
    right: 50, 
    zIndex: 1, 
  },
  mapTypeButton: {
    padding: 10,
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
});
