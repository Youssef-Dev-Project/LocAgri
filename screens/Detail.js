import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import supabase from '../supabaseClient';

const Detail = ({ route, navigation }) => {
  const { agriculteur } = route.params;
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [exploitations, setExploitations] = useState([]);

  const renderSexe = () => {
    return agriculteur.Sexe ? 'Homme' : 'Femme';
  };

  const fetchProfilePicture = async (cin) => {
    const profileImagePath = `Agriculteur_PP/${cin}.png`;
    const defaultImagePath = 'Agriculteur_PP/Default.png';

    try {
      let { data, error } = await supabase
        .storage
        .from('LocAgri')
        .getPublicUrl(profileImagePath);

      if (error || !data.publicUrl) {
        ({ data, error } = await supabase
          .storage
          .from('LocAgri')
          .getPublicUrl(defaultImagePath));

        if (error || !data.publicUrl) {
          setProfileImageUri(null);
        } else {
          setProfileImageUri(data.publicUrl);
        }
      } else {
        setProfileImageUri(data.publicUrl);
      }
    } catch (error) {
      setProfileImageUri(null);
    }
  };

  const fetchExploitations = async () => {
    const { data, error } = await supabase
      .from('Exploitation')
      .select('Position_ID, Superficie, Position (Latitude, Longitude)')
      .eq('Owner', agriculteur.CIN_ID);

    if (error) {
      setExploitations([]);
    } else {
      setExploitations(data);
    }
  };

  useEffect(() => {
    fetchProfilePicture(agriculteur.CIN_ID);
    fetchExploitations();
  }, [agriculteur.CIN_ID]);

  const handleLocationClick = (positionId, latitude, longitude) => {
    navigation.navigate('Maps', {
      latitude,
      longitude,
      positionId, // Pass the Position_ID as well
    });
  };

  const tableHead = ['Exp', 'Lat/Lon', 'Sup(m2)'];
  const tableData = exploitations.map((exp, index) => [
    <TouchableOpacity
      style={styles.expCircle}
      key={index}
      onPress={() => handleLocationClick(exp.Position_ID, exp.Position.Latitude, exp.Position.Longitude)}
    >
      <Text style={styles.expText}>{index + 1}</Text>
    </TouchableOpacity>,
    <View style={styles.latLonContainer} key={`latlon-${index}`}>
      <Text style={styles.tableText}>{exp.Position.Latitude}</Text>
      <View style={styles.separator} />
      <Text style={styles.tableText}>{exp.Position.Longitude}</Text>
    </View>,
    exp.Superficie,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detail}>
        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.profileContainer}>
            <Image
              source={profileImageUri ? { uri: profileImageUri } : require('../assets/images/Defaultpp.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <Text style={styles.title}>{agriculteur.Nom} {agriculteur.Prenom}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.detailText}><Text style={styles.label}>CIN:</Text> {agriculteur.CIN_ID}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Sexe:</Text> {renderSexe()}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Date of Birth:</Text> {new Date(agriculteur.DateNaissance).toLocaleDateString()}</Text>
            <Text style={styles.detailText}><Text style={styles.label}>Created At:</Text> {new Date(agriculteur.created_at).toLocaleDateString()}</Text>
            {agriculteur.TAgriculteur && agriculteur.TAgriculteur.Type && (
              <Text style={styles.detailText}><Text style={styles.label}>Statut:</Text> {agriculteur.TAgriculteur.Type}</Text>
            )}
          </View>
          <View style={styles.exploitationSection}>
            <Text style={styles.sectionTitle}>Exploitation</Text>
            {exploitations.length > 0 ? (
              <ScrollView style={styles.tableContainer}>
                <Table borderStyle={{ borderColor: '#2e7d32', borderWidth: 1 }}>
                  <Row data={tableHead} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
                  <Rows data={tableData} textStyle={styles.tableText} />
                </Table>
              </ScrollView>
            ) : (
              <Text style={styles.noDataText}>No exploitation found</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e8f5e9",
  },
  detail: {
    flex: 1,
    backgroundColor: "#a5d6a7",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    maxHeight: '100%', // Ensure it doesn't overflow beyond the screen
  },
  detailContent: {
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    color: "#2e7d32",
  },
  infoContainer: {
    width: '100%',
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: "#1b5e20",
  },
  exploitationSection: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center', // Center content horizontally
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#2e7d32",
    textAlign: 'center', // Center text horizontally
  },
  tableContainer: {
    width: '100%',
    maxHeight: 300, // Adjust height as needed
  },
  tableHeader: {
    height: 40,
    backgroundColor: 'transparent',
  },
  tableHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: "#2e7d32",
  },
  tableText: {
    margin: 6,
    textAlign: 'center',
  },
  latLonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    borderColor: '#2e7d32', // Color of the dashed line
    borderStyle: 'dashed', // Makes the line dashed
    borderWidth: 0, // No border width directly, we use borderColor and borderStyle
    borderTopWidth: 1, // Apply borderTopWidth to create the dashed line effect
    marginVertical: 4, 
  },
  expCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    alignSelf: 'center', // Center the circle within its container
  },
  expText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 18,
    color: "#333",
    textAlign: 'center',
  },
});

export default Detail;
