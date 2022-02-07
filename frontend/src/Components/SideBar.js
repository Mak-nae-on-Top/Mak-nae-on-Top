import * as React from 'react';
import {StyleSheet, View, Text, SafeAreaView, Switch} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

import {HomeStack, AuthStack, BlueprintStack} from './Stacks';

import url from '../ServerURL/url';

export const AuthContext = React.createContext();

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
    margin: 17,
    marginLeft: 18,
    color: '#666666',
  },
  locationLabel: {
    margin: 17,
    marginLeft: 18,
    color: '#666666',
  },
  switchContainer: {
    marginHorizontal: 16,
    width: 24,
    position: 'absolute',
    right: 40,
  },
});

const CustomSidebar = props => {
  const {state, descriptors, navigation} = props;
  let exGroupName = '';
  let newGroup = true;

  return (
    <SafeAreaView style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        {state.routes.map(route => {
          const {drawerLabel, groupName, activeTintColor, locationEnabled} =
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
                onPress={() =>
                  navigation.navigate(route.name, {
                    locationEnabled: locationEnabled,
                  })
                }
              />
            </>
          );
        })}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const Drawer = createDrawerNavigator();

const SideBar = () => {
  //status about alarm & location
  const [locationEnabled, setLocationEnabled] = React.useState(false);
  const [alarmEnabled, setAlarmEnabled] = React.useState(false);

  const toggleLocationSwitch = () => {
    setLocationEnabled(previousState => !previousState);
  };
  const toggleAlarmSwitch = () =>
    setAlarmEnabled(previousState => !previousState);

  // to manage auth status
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            id: action.id,
            userToken: action.token,
            isLoading: false,
          };
        case 'LOG_IN':
          return {
            ...prevState,
            id: action.id,
            isLogout: false,
            userToken: action.token,
          };
        case 'LOG_OUT':
          return {
            ...prevState,
            id: null,
            isLogout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isLogout: false,
      userToken: null,
      id: null,
    },
  );

  // get auth
  React.useEffect(() => {
    // Fetch the token from storage
    const bootstrapAsync = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(credentials);
          dispatch({
            type: 'RESTORE_TOKEN',
            id: credentials.id,
            token: credentials.token,
          });
        } else {
          console.log('No credentials stored');
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      login: async data => {
        const {id, password} = data;
        await axios
          .post(
            url + 'app/login',
            {id: id, password: password},
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(async response => {
            alert(response.data.message);
            response.data.status === 'success'
              ? (await Keychain.setGenericPassword(id, response.data.token),
                dispatch({type: 'LOG_IN', id: id, token: response.data.token}))
              : {};
          })
          .catch(error => {
            console.log(error);
          });
      },
      logout: async () => {
        //handle server side logout
        //not connected with server yet.
        // await axios
        //   .post(
        //     url + 'app/logout',
        //     {
        //       id: state.id,
        //       token: state.userToken,
        //     },
        //     {
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //     },
        //   )
        //   .then(response => {
        //     alert(response.data.message);
        //     console.log(response);
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
        //handle application side logout
        await Keychain.resetGenericPassword();
        dispatch({type: 'LOG_OUT'});
      },
      signup: async data => {
        const {id, password, confirmPassword, name} = data;
        await axios
          .post(
            url + 'app/join',
            {
              id: id,
              password: password,
              password2: confirmPassword,
              name: name,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(response => {
            alert(response.data.message);
            if (response.data.status === 'success') {
              return true;
            } else if (response.data.status === 'fail') {
              return false;
            }
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
        return false;
      },
    }),
    [],
  );

  const CustomDrawerContents = props => {
    return (
      <DrawerContentScrollView {...props}>
        <CustomSidebar {...props} />
        {state.userToken != null ? (
          <>
            <View style={styles.sideBarSection}>
              <Text key="Manage" style={{marginLeft: 10}}>
                Manage
              </Text>
              <View style={styles.sectionSeparator} />
            </View>
            <DrawerItem
              label={() => (
                <Text style={{color: '#666666', fontWeight: 'normal'}}>
                  🔓 Logout
                </Text>
              )}
              onPress={authContext.logout}
            />
          </>
        ) : (
          <></>
        )}
        <View style={styles.sideBarSection}>
          <Text key="Information" style={{marginLeft: 10}}>
            Information
          </Text>
          <View style={styles.sectionSeparator} />
        </View>

        <View style={styles.item}>
          <Text style={styles.locationLabel}>📍 Share my location info</Text>
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
  };

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
          }}
          drawerContent={props => CustomDrawerContents(props)}>
          <Drawer.Screen
            name="Home"
            options={{
              drawerLabel: '🏠 Home',
              groupName: 'Home',
              activeTintColor: '#282828',
              locationEnabled: locationEnabled,
            }}
            component={props => (
              <HomeStack locationEnabled={locationEnabled} props={props} />
            )}
          />

          {state.userToken == null ? (
            <>
              <Drawer.Screen
                name="Login"
                options={{
                  drawerLabel: '🔒 Login',
                  groupName: 'Manage',
                  activeTintColor: '#282828',
                }}
                component={AuthStack}
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
            </>
          ) : (
            <></>
          )}
        </Drawer.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

export default SideBar;
