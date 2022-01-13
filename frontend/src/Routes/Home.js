import React, {useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import SideBar from '../Components/SideBar';
// import {SwipeablePanel} from 'rn-swipeable-panel';

const Home = () => {
  const [parentHeight, setParentHeight] = useState(0);
  // const [panelProps, setPanelProps] = useState({
  //   fullWidth: true,
  //   openLarge: true,
  //   showCloseButton: true,
  //   onClose: () => closePanel(),
  //   onPressCloseButton: () => closePanel(),
  //   // ...or any prop you want
  // });
  // const [isPanelActive, setIsPanelActive] = useState(true);

  // const openPanel = () => {
  //   setIsPanelActive(true);
  // };

  // const closePanel = () => {
  //   setIsPanelActive(false);
  // };

  // const PanelContent = () => {
  //   return (
  //     <>
  //       <View>
  //         <Text>hihihihhiihi</Text>
  //       </View>
  //     </>
  //   );
  // };

  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    setParentHeight(height);
  };
  return (
    <View
      style={{height: '100%', width: '100%', backgroundColor: '#000000'}}
      onLayout={onLayout}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: parentHeight,
          backgroundColor: 'white',
        }}>
        <SideBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    backgroundColor: 'black',
  },
  image: {position: 'absolute', top: 50, right: 30, height: 40, width: 30},
  touchable: {
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container1: {
    // paddingTop: 30,
    // alignItems: 'center',
    // flex: 0,
  },
  container2: {
    // flex: 1,
  },
  stretch: {
    // flex: 0,
    // width: 100,
    // height: 100,
    resizeMode: 'stretch',
  },
});

export default Home;
