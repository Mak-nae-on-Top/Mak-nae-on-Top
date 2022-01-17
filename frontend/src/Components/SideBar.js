import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

import hamburger from '../images/Hamburger.png';
import {HomeScreen, LoginScreen, BlueprintScreen} from './Screens';

const HamburgerIcon = props => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={hamburger}
          style={{
            marginLeft: 20,
            height: 30,
            width: 30,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const CustomSidebar = props => {
  const {state, descriptors, navigation} = props;
  let exGroupName = '';
  let newGroup = true;

  return (
    <SafeAreaView style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        {state.routes.map(route => {
          const {drawerLabel, groupName, activeTintColor} =
            descriptors[route.key].options;
          exGroupName !== groupName
            ? [(newGroup = true), (exGroupName = groupName)]
            : (newGroup = false);
          return (
            <>
              {newGroup ? (
                <View style={styles.sideBarSection}>
                  <Text key={groupName} style={{marginLeft: 10}}>
                    {groupName}
                  </Text>
                  <View style={styles.sectionSeparator} />
                </View>
              ) : null}
              <DrawerItem
                key={route.key}
                label={({color}) => <Text style={{color}}>{drawerLabel}</Text>}
                focused={
                  state.routes.findIndex(e => e.name === route.name) ===
                  state.index
                }
                activeTintColor={activeTintColor}
                onPress={() => navigation.navigate(route.name)}
              />
            </>
          );
        })}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideBarSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  sectionSeparator: {
    flex: 1,
    backgroundColor: 'black',
    height: 1,
    marginLeft: 10,
    marginRight: 18,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireLabel: {
    margin: 16,
    color: '#666666',
  },
  locationLabel: {
    margin: 16,
    color: '#666666',
  },
  switchContainer: {
    marginHorizontal: 16,
    width: 24,
    position: 'absolute',
    right: 40,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: ' ',
          headerLeft: () => <HamburgerIcon navigationProps={navigation} />,
        }}
      />
    </Stack.Navigator>
  );
};

const LoginStack = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerLeft: () => <HamburgerIcon navigationProps={navigation} />,
      }}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: ' ',
        }}
      />
    </Stack.Navigator>
  );
};

const BlueprintStack = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerLeft: () => <HamburgerIcon navigationProps={navigation} />,
      }}>
      <Stack.Screen
        name="BlueprintScreen"
        component={BlueprintScreen}
        options={{
          title: ' ',
        }}
      />
    </Stack.Navigator>
  );
};

const SideBar = () => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const toggleLocationSwitch = () =>
    setLocationEnabled(previousState => !previousState);
  const toggleAlarmSwitch = () =>
    setAlarmEnabled(previousState => !previousState);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={props => {
          return (
            <DrawerContentScrollView {...props}>
              <CustomSidebar {...props} />
              <View style={styles.sideBarSection}>
                <Text key="Information" style={{marginLeft: 10}}>
                  Information
                </Text>
                <View style={styles.sectionSeparator} />
              </View>
              <View style={styles.item}>
                <Text style={styles.locationLabel}>
                  📍 Share my location info
                </Text>
                <View style={styles.switchContainer}>
                  <Switch
                    trackColor={{false: '#767577', true: '#d3e3d6'}}
                    thumbColor={locationEnabled ? '#4dff73' : '#f4f3f4'}
                    ios_backgroundColor="#d3e3d6"
                    onValueChange={toggleLocationSwitch}
                    value={locationEnabled}
                  />
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.fireLabel}>🚨 Get fire alarm</Text>
                <View style={styles.switchContainer}>
                  <Switch
                    trackColor={{false: '#767577', true: '#d3e3d6'}}
                    thumbColor={alarmEnabled ? 'red' : '#f4f3f4'}
                    ios_backgroundColor="#d3e3d6"
                    onValueChange={toggleAlarmSwitch}
                    value={alarmEnabled}
                  />
                </View>
              </View>
            </DrawerContentScrollView>
          );
        }}>
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: '🏠 Home',
            groupName: 'Home',
            activeTintColor: '#282828',
          }}
          component={HomeStack}
        />

        <Drawer.Screen
          name="Login"
          options={{
            drawerLabel: '🔒 Login',
            groupName: 'Manage',
            activeTintColor: '#282828',
          }}
          component={LoginStack}
        />

        <Drawer.Screen
          name="Blueprint"
          options={{
            drawerLabel: '📷 Make a blueprint',
            groupName: 'Manage',
            activeTintColor: '#282828',
          }}
          component={BlueprintStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default SideBar;
