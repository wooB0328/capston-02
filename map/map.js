import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import YearPicker from './yearpicker';


export default function Map() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 36,
          longitude: 128,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      />
      <View style={styles.container2}>
      <Text>연도선택 </Text>
     
      <YearPicker />
      <Text>~</Text>
      <YearPicker />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '80%',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});