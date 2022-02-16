import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';

const UploadBtn = ({onPress, children}) => {
  switch (children) {
    case 'Delete Blueprint':
      return (
        <Pressable
          onPress={onPress}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#ff7575' : '#ff2626',
            },
            styles.container,
          ]}>
          <Text style={styles.text}>{children}</Text>
        </Pressable>
      );
    case 'Upload Blueprint':
      return (
        <Pressable
          onPress={onPress}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#86E57F' : '#2ca11d',
            },
            styles.container,
          ]}>
          <Text style={styles.text}>{children}</Text>
        </Pressable>
      );
    default:
      return (
        <Pressable
          onPress={onPress}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#a3a3a3' : '#4f4f4f',
            },
            styles.container,
          ]}>
          <Text style={styles.text}>{children}</Text>
        </Pressable>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    minWidth: '45%',
    maxWidth: '100%',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 10,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});

export default UploadBtn;
