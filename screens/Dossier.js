import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import supabase from '../supabaseClient'; 
import { format } from 'date-fns'; // Import the date-fns library for date formatting

export default function Dossier({ navigation }) {
  const [dossierDetails, setDossierDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDossierDetails();
  }, []);

  async function fetchDossierDetails() {
    try {
      const { data, error } = await supabase
        .from('Dossier')
        .select(`
          created_at,
          CIN,
          Agriculteur (
            Nb_Dossiers
          )
        `);

      if (error) {
        throw error;
      }

      // Format the Dossier_ID as DD/MM/YYYY/CIN/Nb_Dossiers
      const formattedData = data.map(item => ({
        ...item,
        Dossier_ID: `${format(new Date(item.created_at), 'dd/MM/yyyy')}/${item.CIN}/${item.Agriculteur?.Nb_Dossiers || 'N/A'}`
      }));

      console.log("Fetched data:", formattedData); 
      setDossierDetails(formattedData || []); 
    } catch (error) {
      console.error("Error fetching dossier details:", error.message);
      setError(error.message); 
    } finally {
      setLoading(false); 
      setRefreshing(false); 
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchDossierDetails(); 
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => navigation.navigate("Detail", { dossier: item })}
    >
      <Ionicons
        name="folder"
        size={50}
        color="#388e3c"
        style={styles.itemIcon}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{`ID: ${item.Dossier_ID}`}</Text>
        <Text style={styles.itemSubText}>{`CIN: ${item.CIN || 'N/A'}`}</Text>
        <Text style={styles.itemSubText}>{`Nb_Dossiers: ${item.Agriculteur?.Nb_Dossiers || 'N/A'}`}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.view}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AntDesign
              name="logout"
              size={25}
              color="white"
              style={styles.logoutButton}
            />
            <Text style={styles.title}>Dossier</Text>
            <MaterialIcons
              name="search"
              size={24}
              color="white"
              style={styles.searchToggleButton}
            />
          </View>
          <View style={styles.listContainerWrapper}>
            <View style={styles.listContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#388e3c" />
              ) : error ? (
                <Text style={styles.errorText}>{`Error: ${error}`}</Text>
              ) : (
                <FlatList
                  data={dossierDetails}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.Dossier_ID.toString()}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                />
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1 },
  container: { flex: 1, padding: 15, paddingTop: 50, backgroundColor: "#e8f5e9", position: "relative" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 16, paddingTop: 40, position: "relative", backgroundColor: "#388e3c", borderRadius: 20 },
  title: { fontSize: 24, color: "white", textAlign: "center", position: "absolute", left: 0, right: 0 },
  logoutButton: { padding: 10, position: "absolute", left: 10, zIndex: 1 },
  searchToggleButton: { padding: 10, position: "absolute", right: 10, zIndex: 1 },
  listContainerWrapper: { flex: 1, overflow: "hidden" },
  item: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    backgroundColor: "#a5d6a7", 
    borderRadius: 10, 
    marginBottom: 15, 
    marginHorizontal: 5, 
    elevation: 3,
  },
  itemIcon: {
    marginRight: 10, // Space between icon and text
  },
  itemTextContainer: { 
    flex: 1, 
    paddingLeft: 10, // Space between icon and text container
  },
  itemText: { 
    fontSize: 18, 
    textAlign: "left" 
  },
  itemSubText: { 
    fontSize: 14, 
    color: "#666", 
    textAlign: "left" 
  },
  errorText: { 
    fontSize: 16, 
    color: "red", 
    textAlign: "center", 
    marginTop: 20 
  },
});
