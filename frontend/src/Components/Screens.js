import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import 'react-native-gesture-handler';
import {Searchbar} from 'react-native-paper';
import SlidingUpPanel from 'rn-sliding-up-panel';
import bar from '../images/Bar.png';

const HomeScreen = () => {
  const windowHeight = Dimensions.get('window').height;
  const defaultProps = {
    draggableRange: {top: windowHeight - 100, bottom: 0},
  };
  const {top, bottom} = defaultProps.draggableRange;
  const [draggedValue] = useState(() => new Animated.Value(0));

  const closePanel = () => {
    draggedValue.setValue(0);
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

  const clickOnSearchBar = () => {
    draggedValue.setValue(top);
  };

  const PanelContent = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const onChangeSearch = query => setSearchQuery(query);
    return (
      <>
        <View>
          <Image
            source={bar}
            style={{
              marginTop: 6,
              height: 5,
              width: 50,
            }}
          />
        </View>
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
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Type your destination"
            onChangeText={onChangeSearch}
            value={searchQuery}
            onFocus={clickOnSearchBar}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView flex={1}>
      <View style={styles.MainContainer}>
        <Text style={{fontSize: 25, color: 'black'}}> Home Screen </Text>
      </View>
      <Button
        color="black"
        title="🔍 Click to search"
        onPress={() => this._panel.show(250)}
      />
      <SlidingUpPanel
        snappingPoints={[250, top]}
        animatedValue={draggedValue}
        draggableRange={{top: top, bottom: bottom}}
        onBackButtonPress="true"
        containerStyle={styles.PanelContainer}
        height={windowHeight - 100}
        friction={3}
        ref={c => (this._panel = c)}>
        <PanelContent />
      </SlidingUpPanel>
    </SafeAreaView>
  );
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
  };

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
  PanelContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 30,
    // justifyContent: 'center',
  },
});

export {HomeScreen, LoginScreen, BlueprintScreen};
