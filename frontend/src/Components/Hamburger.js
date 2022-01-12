import React, {useState, useCallback} from 'react';
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
  SafeAreaView,
} from 'react-native';
import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

import hamburger from '../images/Hamburger.png';
import Home from '../Routes/Home';

const DropDown = props => {
  // const [isActive, setIsActive] = useState(false);
  //   const dropDownItems = [
  //     {id: 1, name: '', path: '/profile'},
  //   ];

  // const onActiveToggle = useCallback(() => {
  //   setIsActive(prev => !prev);
  // }, []);

  // const CustomDrawerComponent = props => (
  //   <SafeAreaView>
  //     <DrawerNavigatorItems {...props} />
  //   </SafeAreaView>
  // );

  // const RootStack = createDrawerNavigator(
  //   {
  //     HomePage: Home,
  //   },
  //   {
  //     contentComponent: props => <CustomDrawerComponent {...props} />,
  //   },
  // );

  // const AppContainer = createAppContainer(RootStack);

  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={styles.view}>
      <TouchableOpacity style={styles.touchable} onPress={toggleDrawer}>
        <Image source={hamburger} style={styles.image} />
        {/* <AppContainer /> */}
        {/* <DropdownMenu isActive={isActive}></DropdownMenu> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
  },
  image: {position: 'absolute', top: 50, right: 25, height: 40, width: 30},
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

export default DropDown;
