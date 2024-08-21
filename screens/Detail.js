import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
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
      positionId,
    });
  };

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
              exploitations.map((exp, index) => (
                <TouchableOpacity
                  style={styles.card}
                  key={index}
                  onPress={() => handleLocationClick(exp.Position_ID, exp.Position.Latitude, exp.Position.Longitude)}
                >
                  <View style={styles.expCircle}>
                    <Text style={styles.expText}>{index + 1}</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardText}><Text style={styles.label}>Latitude:</Text> {exp.Position.Latitude}</Text>
                    <Text style={styles.cardText}><Text style={styles.label}>Longitude:</Text> {exp.Position.Longitude}</Text>
                    <Text style={styles.cardText}><Text style={styles.label}>Superficie:</Text> {exp.Superficie} m²</Text>
                  </View>
                </TouchableOpacity>
              ))
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#2e7d32",
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#dcedc8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#81c784',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  expCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  expText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 18,
    color: "#333",
    textAlign: 'center',
  },
});

export default Detail;
