import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Dossier({ navigation }) {
  // Sample data to display in cards
  const sampleData = [
    {
      id: '1',
      Nom: 'John',
      Prenom: 'Doe',
      CIN_ID: 'ABC123',
      imageUrl: 'https://whpyyzpfmysuwipdcypn.supabase.co/storage/v1/object/public/LocAgri/Agriculteur_PP/Default.png',
    },
    {
      id: '2',
      Nom: 'Jane',
      Prenom: 'Smith',
      CIN_ID: 'DEF456',
      imageUrl: 'https://whpyyzpfmysuwipdcypn.supabase.co/storage/v1/object/public/LocAgri/Agriculteur_PP/Default.png',
    },
  ];

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => navigation.navigate('Detail', { agriculteur: item })}
    >
      <Ionicons name="folder" size={50} color="#388e3c" style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>{`${item.Nom} ${item.Prenom}`}</Text>
        <Text style={styles.itemSubText}>CIN: {item.CIN_ID}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.view}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Bubble elements */}
          <View style={[styles.bubble, styles.topBubble]}></View>
          <View style={[styles.bubble, styles.bottomBubble]}></View>
          <View style={[styles.bubble, styles.rightBubble]}></View>
          <View style={[styles.bubble, styles.leftBubble]}></View>
          <View style={[styles.bubble, styles.extraBubble1]}></View>
          <View style={[styles.bubble, styles.extraBubble2]}></View>
          <View style={[styles.bubble, styles.extraBubble3]}></View>
          <View style={[styles.bubble, styles.extraBubble4]}></View>
          <View style={[styles.bubble, styles.extraBubble5]}></View>

          <View style={styles.header}>
  <AntDesign name="logout" size={25} color="white" style={styles.logoutButton} />
  <Text style={styles.title}>Dossier</Text>
  <MaterialIcons name="search" size={24} color="white" style={styles.searchToggleButton} />
</View>


          <View style={styles.listContainerWrapper}>
            <View style={styles.listContainer}>
              <FlatList
                data={sampleData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 15 }}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 50,
    backgroundColor: "#e8f5e9",
    position: 'relative',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingTop: 40,
    position: "relative",
    backgroundColor: "#388e3c",
    borderRadius: 20,
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
  searchToggleButton: {
    padding: 10,
    position: "absolute",
    right: 10,
    zIndex: 1,
  },


  listContainerWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#a5d6a7",
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    elevation: 3,
  },
  itemImage: {
    width: 50, // Smaller width for the image
    height: 50, // Smaller height for the image
    borderRadius: 25, // Circular image
    marginRight: 10, // Space between image and text
  },
  itemTextContainer: {
    flex: 1, // Allow text to take the remaining space
  },
  itemText: {
    fontSize: 18,
    textAlign: 'left',
  },
  itemSubText: {
    fontSize: 14,
    color: "#666",
    textAlign: 'left',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#388e3c',
    borderRadius: 50,
  },
  topBubble: {
    top: -60,
    left: 10,
    width: 120,
    height: 120,
    opacity: 0.3,
  },
  bottomBubble: {
    bottom: -60,
    right: 10,
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  rightBubble: {
    top: '50%',
    right: -70,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  leftBubble: {
    top: '50%',
    left: -70,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  extraBubble1: {
    top: 100,
    left: 60,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
  extraBubble2: {
    bottom: 100,
    right: 60,
    width: 150,
    height: 150,
    opacity: 0.2,
  },
  extraBubble3: {
    top: 200,
    right: 10,
    width: 70,
    height: 70,
    opacity: 0.3,
  },
  extraBubble4: {
    bottom: 200,
    left: 10,
    width: 70,
    height: 70,
    opacity: 0.3,
  },
  extraBubble5: {
    top: 300,
    left: 80,
    width: 90,
    height: 90,
    opacity: 0.2,
  },
});
