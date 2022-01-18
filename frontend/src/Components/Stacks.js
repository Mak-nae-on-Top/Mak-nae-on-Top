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

const SignupStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{
          title: ' ',
        }}
      />
    </Stack.Navigator>
  );
};

export {HomeStack, LoginStack, BlueprintStack, SignupStack};
