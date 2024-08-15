import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: bottom }]}>
      {state.routes.map((route, index) => {
        // Static icons for each tab
        let iconName;
        if (route.name === 'Home') {
          iconName = state.index === index ? 'accessibility' : 'accessibility-outline';
        } else if (route.name === 'Maps') {
          iconName = state.index === index ? 'map' : 'map-outline';
        } else if (route.name === 'Dossier') {
          iconName = state.index === index ? 'book' : 'folder-outline';
        }

        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // Detect tab reselection and clear state
          if (!event.defaultPrevented && state.index === index) {
            if (route.name === 'Maps') {
              navigation.navigate(route.name, { refresh: true }); // Pass refresh flag
            }
          } else {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: state.index === index }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={iconName} // Use the static icon name
              size={24}
              color={state.index === index ? 'white' : 'lightgray'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#388e3c',
    borderRadius: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    height: 50,
    elevation: 5, // Add shadow on Android
    shadowColor: '#000', // Add shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomTabBar;
