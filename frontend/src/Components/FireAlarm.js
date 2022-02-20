import * as React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  MainContainer: {
    position: 'absolute',
    zIndex: 100,
    width: windowWidth,
    top: 20,
    textAlign: 'center',
  },
});

const FireAlarm = () => {
  return (
    <View style={styles.MainContainer}>
      <Text>🚨Fire Detected🚨</Text>
      <Text>Follow the route and evacuate immediately</Text>
    </View>
  );
};

export default FireAlarm;
