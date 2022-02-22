import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';

import hamburger from '../images/Hamburger.png';
import {
  HomeScreen,
  LoginScreen,
  BlueprintScreen,
  SignupScreen,
} from '../Routes/Screens';

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

const Stack = createStackNavigator();

const HomeStack = ({locationEnabled, fireAlarmEnabled, props}) => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
      }}>
      <Stack.Screen
        name="HomeScreen"
        options={{
          title: ' ',
          headerLeft: () => (
            <HamburgerIcon navigationProps={props.navigation} />
          ),
        }}>
        {props => (
          <HomeScreen
            {...props}
            locationEnabled={locationEnabled}
            fireAlarmEnabled={fireAlarmEnabled}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const AuthStack = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerLeft: () => <HamburgerIcon navigationProps={navigation} />,
      }}>
      <Stack.Screen
        name="LoginScreen"
        options={{
          title: ' ',
        }}>
        {props => <LoginScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="SignupScreen"
        options={{
          title: ' ',
        }}>
        {props => <SignupScreen {...props} />}
      </Stack.Screen>
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
        options={{
          title: ' ',
        }}>
        {props => <BlueprintScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export {HomeStack, AuthStack, BlueprintStack};
