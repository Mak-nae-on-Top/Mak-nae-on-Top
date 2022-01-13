import React, {useState} from 'react';
import {StyleSheet, View, Text, SafeAreaView, Button} from 'react-native';
import 'react-native-gesture-handler';

import {SwipeablePanel} from 'rn-swipeable-panel';

const HomeScreen = () => {
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: true,
    // showCloseButton: true,
    closeOnTouchOutside: true,
    onClose: () => closePanel(),
    // onPressCloseButton: () => closePanel(),
  });
  const [isPanelActive, setIsPanelActive] = useState();

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const PanelContent = () => {
    return (
      <>
        <View>
          <Text>hihihihhiihi</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView flex={1}>
      <View style={styles.MainContainer}>
        <Text style={{fontSize: 25, color: 'black'}}> Home Screen </Text>
      </View>
      <View style={styles.SearchBtn}>
        <Button color="black" title="🔍 Click to search" onPress={openPanel} />
      </View>
      <SwipeablePanel {...panelProps} isActive={isPanelActive}>
        <PanelContent />
      </SwipeablePanel>
    </SafeAreaView>
  );
};

const LoginScreen = () => {
  return (
    <SafeAreaView flex={1}>
      <View style={styles.MainContainer}>
        <Text style={{fontSize: 25, color: 'black'}}> Login Screen </Text>
      </View>
    </SafeAreaView>
  );
};

const BlueprintScreen = () => {
  return (
    <SafeAreaView flex={1}>
      <View style={styles.MainContainer}>
        <Text style={{fontSize: 25, color: 'black'}}> Blueprint Screen </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  BtnContainer: {
    // flex: 1,
    flexWrap: 'wrap',
  },
  PanelBtn: {
    borderWidth: 2,
    alignSelf: 'flex-start',
    minWidth: '48%',
    textAlign: 'center',
    // width: '33%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  SearchBtn: {
    width: '50%',
    alignSelf: 'center',
  },
});

export {HomeScreen, LoginScreen, BlueprintScreen};
