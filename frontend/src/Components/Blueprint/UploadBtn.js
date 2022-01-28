import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';

const UploadBtn = ({onPress, children}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? '#86E57F' : '#41AF39',
        },
        styles.container,
      ]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
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
    borderRadius: 25,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});

export default UploadBtn;
