import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from 'react-native';
import 'react-native-gesture-handler';

import {SwipeablePanel} from 'rn-swipeable-panel';

import SearchBar from './SearchBar';

const HomeScreen = () => {
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: false,
    smallPanelHeight: 350,
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

  const handleExitBtn = () => {
    closePanel();
  };

  const handleToiletBtn = () => {
    closePanel();
  };
  const handleFireplugBtn = () => {
    closePanel();
  };
  const handleDefiBtn = () => {
    closePanel();
  };

  const PanelContent = () => {
    // const [flexDirection, setflexDirection] = useState("column");
    return (
      <>
        <View style={styles.padding}>
          <View style={[styles.row]}>
            <TouchableOpacity style={styles.PanelBtn} onPress={handleExitBtn}>
              <Text style={[styles.buttonLabel]}>Exit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.PanelBtn} onPress={handleToiletBtn}>
              <Text style={[styles.buttonLabel]}>Toilet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.PanelBtn}
              onPress={handleFireplugBtn}>
              <Text style={[styles.buttonLabel]}>Fireplug</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.PanelBtn} onPress={handleDefiBtn}>
              <Text style={[styles.buttonLabel]}>Defibrillator</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchBar}>{<SearchBar />}</View>
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '3%',
    marginBottom: 6,
    minWidth: '44%',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  SearchBtn: {
    width: '50%',
    alignSelf: 'center',
  },
  buttonLabel: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 20,
    fontWeight: '700',
    color: 'coral',
    textAlign: 'center',
  },
  padding: {
    padding: 10,
  },
  searchBar: {
    width: '90%',
    alignSelf: 'center',
  },
});

export {HomeScreen, LoginScreen, BlueprintScreen};
