import * as React from 'react';
import {StyleSheet, View, Dimensions, Text} from 'react-native';

// user's cellphone size
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// for styled components
const styles = StyleSheet.create({
  MainContainer: {
    position: 'absolute',
    zIndex: 100,
    width: windowWidth,
    backgroundColor: 'white',
    height: windowHeight * 0.15,
    bottom: -30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderTopWidth: 6,
  },
  TitleText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red',
    marginVertical: 10,
  },
  ContentText: {
    fontSize: 16,
    marginVertical: 10,
  },
});

const FireAlarm = () => {
  return (
    <View style={styles.MainContainer}>
      <Text style={styles.TitleText}>🚨Fire Detected🚨</Text>
      <Text style={styles.ContentText}>
        Follow the route and evacuate immediately
      </Text>
    </View>
  );
};

export default React.memo(FireAlarm);
