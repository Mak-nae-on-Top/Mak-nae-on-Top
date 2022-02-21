import * as React from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import 'react-native-gesture-handler';
import {TextInput, IconButton} from 'react-native-paper';
import SlidingUpPanel from 'rn-sliding-up-panel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import bar from '../images/Bar.png';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  padding: {
    padding: 10,
    paddingTop: 20,
  },
  PanelBtn: {
    marginTop: 3,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: '#E6E6E6',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    minWidth: '16%',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  PanelContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  MainContainer: {
    position: 'absolute',
    zIndex: 100,
    width: windowWidth,
    bottom: -30,
  },
  BarImage: {
    borderRadius: 10,
    tintColor: '#707070',
    marginTop: 10,
    height: 5,
    width: 50,
  },
  searchBar: {
    flexDirection: 'row',
    width: '100%',
    // textAlign: 'center',
  },
  dstInput: {
    marginHorizontal: '4%',
    width: '70%',
  },
  dstBtn: {
    // width: '50%',
    // height: 'auto',
  },
});

const BottomBar = props => {
  // panel contents
  const defaultProps = {
    draggableRange: {top: windowHeight - 100, bottom: 0},
  };
  const {top, bottom} = defaultProps.draggableRange;
  const [draggedValue] = React.useState(() => new Animated.Value(0));

  const closePanel = () => {
    draggedValue.setValue(0);
  };

  const sendDestination = dst => {
    props.getDestination(dst);
  };

  const PanelContent = () => {
    const [destination, setDestination] = React.useState('');
    const handleExitBtn = () => {
      sendDestination('exit');
      closePanel();
    };

    const handleToiletBtn = () => {
      sendDestination('toilet');
      closePanel();
    };
    const handleFireExtinguisherBtn = () => {
      sendDestination('fire extinguisher');
      closePanel();
    };
    const handleDefibrillatorBtn = () => {
      sendDestination('defibrillator');
      closePanel();
    };

    const clickOnSearchBar = () => {
      draggedValue.setValue(top);
    };
    return (
      <>
        <View>
          <Image source={bar} style={styles.BarImage} />
        </View>
        <View style={styles.padding}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.PanelBtn} onPress={handleExitBtn}>
              <MaterialCommunityIcons name="exit-run" size={60} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.PanelBtn} onPress={handleToiletBtn}>
              <MaterialCommunityIcons name="human-male-female" size={60} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.PanelBtn}
              onPress={handleFireExtinguisherBtn}>
              <FontAwesome
                name="fire-extinguisher"
                size={60}
                style={{marginLeft: 5, marginRight: 5}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.PanelBtn}
              onPress={handleDefibrillatorBtn}>
              <FontAwesome name="heartbeat" size={60} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.dstInput}
            placeholder="Type your destination"
            label="Destination"
            value={destination}
            onChangeText={dst => setDestination(dst)}
            onFocus={clickOnSearchBar}
          />
          <IconButton
            icon="map-search-outline"
            color="black"
            style={styles.dstBtn}
            size={40}
            onPress={() => {
              sendDestination(destination), setDestination(''), closePanel();
            }}
          />
        </View>
      </>
    );
  };
  return (
    <View style={styles.MainContainer}>
      <View style={{marginBottom: 20}}>
        <Button
          color="black"
          title="🔍 Click to search"
          onPress={() => this._panel.show(200)}
        />
      </View>
      <SlidingUpPanel
        snappingPoints={[200, top]}
        animatedValue={draggedValue}
        draggableRange={{top: top, bottom: bottom}}
        containerStyle={styles.PanelContainer}
        height={windowHeight - 100}
        friction={5}
        ref={c => (this._panel = c)}>
        <PanelContent />
      </SlidingUpPanel>
    </View>
  );
};

export default BottomBar;
