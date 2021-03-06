import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import {ListItem, Icon, Overlay, Button as Btn} from 'react-native-elements';
import 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NumericInput from 'react-native-numeric-input';

import logo from '../images/Logo.png';
import Beacon from '../Components/Beacon/Beacons.ios.js';
import UploadBtn from '../Components/Blueprint/UploadBtn';
import UploadResponse from '../Components/Blueprint/UploadResponse';
import {AuthContext} from '../Components/AuthContextProvider';
import TakeCoordinate from '../Components/Blueprint/TakeCoordinate';
import SetBeaconInfos from '../Components/Beacon/SetBeaconInfos';
import BottomBar from '../Components/BottomBar';

// import for server transmission
import axios from 'axios';
import {Url} from '../ServerURL/url';

// user's cellphone size
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// for styled components
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  PanelBtn: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: '#E6E6E6',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    minWidth: '16%',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overlayBtnContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignSelf: 'center',
  },
  overlayBtn: {
    width: windowWidth * 0.43,
    height: 40,
    marginHorizontal: windowWidth * 0.02,
  },
  inputView: {
    backgroundColor: '#D4D4D4',
    borderRadius: 30,
    width: '80%',
    height: 45,
    marginBottom: 20,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  loginBtn: {
    minWidth: '38.5%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    alignSelf: 'flex-start',
    marginHorizontal: '1.5%',
    height: 37,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  registerBtn: {
    backgroundColor: 'green',
    borderRadius: 30,
    width: '80%',
    height: 45,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AccList: {
    marginTop: 50,
    borderTopWidth: 1,
  },
  uploadBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  imageBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  ResponseImage: {
    marginVertical: 12,
    alignItems: 'center',
  },
  UploadSuccessContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputInfoView: {
    backgroundColor: '#D4D4D4',
    borderRadius: 5,
    height: 35,
    width: '95%',
    marginVertical: 5,
    alignSelf: 'center',
  },
});

const HomeScreen = ({locationEnabled, fireAlarmEnabled}) => {
  const [destination, setDestination] = React.useState('');
  const getDestination = dst => {
    setDestination(dst);
  };

  return (
    <SafeAreaView flex={1}>
      <View style={styles.MainContainer}>
        {locationEnabled ? (
          <>
            <BottomBar getDestination={getDestination} />
            <Beacon
              destination={destination}
              fireAlarmEnabled={fireAlarmEnabled}
            />
          </>
        ) : (
          <>
            <Text style={{fontSize: 25, color: 'black'}}>
              If you want to use BFF service,
            </Text>
            <Text style={{fontSize: 25, color: 'black'}}>please agree to</Text>
            <Text style={{fontSize: 25, color: 'black', fontWeight: 'bold'}}>
              Share my location info
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const LoginScreen = ({navigation}) => {
  const {authContext, state} = React.useContext(AuthContext);

  const [account, setAccount] = React.useState({
    id: '',
    password: '',
  });

  const handleAccount = (key, value) => {
    setAccount({
      ...account,
      [key]: value,
    });
  };

  return (
    <SafeAreaView flex={1}>
      <View style={styles.MainContainer}>
        <View>
          <Image
            source={logo}
            style={{
              height: 200,
              width: 200,
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter your ID"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={id => handleAccount('id', id)}
            placeholderTextColor="#282828"
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="
            Enter your Password"
            secureTextEntry={true}
            textContentType="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={password => handleAccount('password', password)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.loginText}>SIGNUP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => authContext.login(account)}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const BlueprintScreen = () => {
  const {authContext, state} = React.useContext(AuthContext);

  const modifyCoordinate = (uuid, floor, coordinates, idx) => {
    toggleOverlay2(idx);
    modifyCoordinates(uuid, floor, coordinates);
  };

  const modifyBeaconInfos = (uuid, floor, beaconInfo, idx) => {
    toggleOverlay3(idx);
    enterBeaconLocation(uuid, floor, beaconInfo);
  };

  const [info, setInfo] = React.useState({
    floor: '',
    uuid: '',
    building_name: '',
  });

  const handleInfo = (key, value) => {
    setInfo({
      ...info,
      [key]: value.toString(),
    });
  };

  const [response, setResponse] = React.useState(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState();
  const [blueprints, setBlueprints] = React.useState([]);

  const includeExtra = true;

  const accordionList = [
    {
      title: 'Upload blueprint',
      iconName: 'map',
    },
    {
      title: 'Uploaded blueprint list',
      iconName: 'list',
    },
    {
      title: 'Taking coordinates of each room',
      iconName: 'push-pin',
    },
    {
      title: 'Set location of beacon',
      iconName: 'add-location',
    },
  ];

  const actions = [
    {
      title: 'Take Blueprint',
      type: 'capture',
      options: {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: true,
        includeExtra,
        quality: 0,
      },
    },
    {
      title: 'Select Blueprint',
      type: 'library',
      options: {
        mediaType: 'photo',
        includeBase64: true,
        includeExtra,
        quality: 0,
      },
    },
  ];

  const actions2 = [
    {
      title: 'Upload Blueprint',
      type: 'upload',
    },
    {
      title: 'Delete Blueprint',
      type: 'delete',
    },
  ];

  const deleteBlueprint = async item => {
    await axios
      .post(
        Url + 'app/manager/deleteFloor',
        {uuid: item.uuid, floor: item.floor},
        {
          headers: {
            Authorization: `Bearer ${state.userToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        if (response.data.status === 'success') {
          getBlueprints();
        }
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  };

  const uploadBlueprint = async () => {
    await axios
      .post(
        Url + 'app/manager/saveMap',
        {
          uuid: info.uuid,
          floor: info.floor,
          building_name: info.building_name,
          base64: response.assets[0].base64,
          image_height: response.assets[0].height,
          image_width: response.assets[0].width,
        },
        {
          headers: {
            Authorization: `Bearer ${state.userToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        if (response.data.status === 'success') {
          setUploadSuccess(true);
          setResponse(null);
          setInfo({
            floor: null,
            uuid: '',
          });
        }
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  };

  const modifyCoordinates = async (uuid, floor, coordinates) => {
    await axios
      .post(
        Url + 'app/manager/modifyCoordinates',
        {
          uuid: uuid,
          floor: floor,
          coordinates: coordinates,
        },
        {
          headers: {
            Authorization: `Bearer ${state.userToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        if (response.data.status === 'success') {
          getBlueprints();
        }
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  };

  const enterBeaconLocation = async (uuid, floor, beaconInfo) => {
    await axios
      .post(
        Url + 'app/manager/enterBeaconLocation',
        {
          uuid: uuid,
          floor: floor,
          beaconInfo: beaconInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${state.userToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        if (response.data.status === 'success') {
          getBlueprints();
        }
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  };

  const getBlueprints = async () => {
    await axios
      .post(
        Url + 'app/manager/loadAllMap',
        {},
        {
          headers: {
            Authorization: `Bearer ${state.userToken}`,
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        console.log(response);
        // base64, floor, uuid, buildingName, image_width, image_height, blueprint_width, blueprint_height, coordinate (array)
        const allInformation = [];
        response.data.map(value => {
          allInformation.push(value);
        });
        allInformation !== blueprints && setBlueprints(allInformation);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  };

  const handleGetBlueprintBtn = (type, options) => {
    if (type === 'capture') {
      launchCamera(options, setResponse);
    } else {
      launchImageLibrary(options, setResponse);
    }
    setUploadSuccess(false);
  };

  const handleChosenBlueprintBtn = type => {
    if (type === 'upload') {
      uploadBlueprint();
    } else {
      setUploadSuccess(false);
      setResponse(null);
      setInfo({
        floor: null,
        uuid: '',
        building_name: '',
      });
    }
  };

  const handleAccordionClick = index => {
    activeIndex === index ? setActiveIndex(null) : setActiveIndex(index);
    if (index === 0) setResponse(null);
    else if (index === 1 || index === 2 || index == 3) getBlueprints();
  };

  const [visibleIndex, setVisibleIndex] = React.useState();
  const [visibleIndex2, setVisibleIndex2] = React.useState();
  const [visibleIndex3, setVisibleIndex3] = React.useState();

  const toggleOverlay = (item, idx) => {
    visibleIndex === idx && idx !== null
      ? setVisibleIndex(null)
      : (setVisibleIndex(idx),
        setInfo({
          floor: item.floor,
          uuid: item.uuid,
          building_name: item.building_name,
        }),
        setResponse({
          assets: [
            {
              base64: item.base64,
            },
          ],
        }));
  };

  const toggleOverlay2 = idx => {
    visibleIndex2 === idx && idx !== null
      ? setVisibleIndex2(null)
      : setVisibleIndex2(idx);
  };

  const toggleOverlay3 = idx => {
    visibleIndex3 === idx && idx !== null
      ? setVisibleIndex3(null)
      : setVisibleIndex3(idx);
  };

  const handleBlueprint = index => {
    switch (index) {
      // Upload Blueprint
      case 0:
        return (
          <>
            <View style={styles.uploadBtnContainer}>
              {actions.map(({title, type, options}) => {
                return (
                  <UploadBtn
                    key={title}
                    onPress={() => handleGetBlueprintBtn(type, options)}>
                    {title}
                  </UploadBtn>
                );
              })}
            </View>

            {/* Json response */}
            {/* <UploadResponse>{response}</UploadResponse> */}
            {/* {console.log(response)} */}

            {/* Images that user choose */}
            {response && response?.assets && response?.assets !== undefined && (
              <View style={styles.ResponseImage}>
                <Image
                  resizeMode="contain"
                  style={{width: 300, height: 300}}
                  source={{uri: response.assets[0].uri}}
                />
              </View>
            )}

            {uploadSuccess ? (
              <View style={styles.UploadSuccessContainer}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginBottom: 20,
                  }}>
                  Successfully Uploaded
                </Text>
              </View>
            ) : (
              []
            )}

            {/* Upload Btn & Delete Btn */}
            {response && !response.didCancel && (
              <>
                <View style={[styles.row, {justifyContent: 'center'}]}>
                  <Text style={{fontWeight: 'bold', marginBottom: 10}}>
                    Select your blueprint's floor{'\n'}Type beacon uuid /
                    buildng name
                  </Text>
                  <View style={{marginBottom: 5}}>
                    <NumericInput
                      value={parseInt(info.floor, 10)}
                      onChange={value => handleInfo('floor', value)}
                      totalWidth={windowWidth * 0.95}
                      totalHeight={35}
                      rounded
                      iconStyle={{color: 'white'}}
                      rightButtonBackgroundColor="#4f4f4f"
                      leftButtonBackgroundColor="#a3a3a3"
                    />
                  </View>
                  <View style={styles.inputInfoView}>
                    <TextInput
                      name="uuid"
                      key="uuid"
                      style={[styles.TextInput, {width: '100%'}]}
                      placeholder="Type beacon's uuid"
                      autoCorrect={false}
                      clearButtonMode="always"
                      onChangeText={value => handleInfo('uuid', value)}
                      placeholderTextColor="#282828"
                    />
                  </View>
                  <View style={styles.inputInfoView}>
                    <TextInput
                      name="building_name"
                      key="building_name"
                      style={[styles.TextInput, {width: '100%'}]}
                      placeholder="Type building's Name"
                      autoCorrect={false}
                      clearButtonMode="always"
                      onChangeText={value => handleInfo('building_name', value)}
                      placeholderTextColor="#282828"
                    />
                  </View>
                </View>
                <View style={styles.uploadBtnContainer}>
                  {actions2.map(({title, type}) => {
                    return (
                      <UploadBtn
                        key={title}
                        onPress={() => handleChosenBlueprintBtn(type)}>
                        {title}
                      </UploadBtn>
                    );
                  })}
                </View>
              </>
            )}
          </>
        );
      // Uploaded Blueprint List (fixable)
      case 1:
        return (
          <View>
            {blueprints.map((item, idx) => {
              return (
                <>
                  <Overlay
                    overlayStyle={{
                      width: windowWidth,
                      height: windowHeight,
                      justifyContent: 'center',
                    }}
                    isVisible={visibleIndex === idx}
                    onBackdropPress={() => toggleOverlay(idx)}>
                    <View style={[{justifyContent: 'center'}]}>
                      {response &&
                        response?.assets &&
                        response.assets[0] &&
                        response.assets[0].base64 !== undefined && (
                          <View style={styles.ResponseImage}>
                            <Image
                              resizeMode="contain"
                              style={{
                                width: windowWidth * 0.9,
                                height: windowWidth * 0.9,
                              }}
                              source={{
                                uri: `data:image/jpeg;base64,${response.assets[0].base64}`,
                              }}
                            />
                          </View>
                        )}
                      <View style={styles.imageBtnContainer}>
                        {actions.map(({title, type, options}) => {
                          return (
                            <UploadBtn
                              key={title}
                              onPress={() =>
                                handleGetBlueprintBtn(type, options)
                              }>
                              {title}
                            </UploadBtn>
                          );
                        })}
                      </View>
                      <View style={{alignSelf: 'center', marginBottom: 10}}>
                        <NumericInput
                          value={parseInt(info.floor, 10)}
                          onChange={value => handleInfo('floor', value)}
                          totalWidth={windowWidth * 0.9}
                          totalHeight={40}
                          rounded
                          iconStyle={{color: 'white'}}
                          rightButtonBackgroundColor="#4f4f4f"
                          leftButtonBackgroundColor="#a3a3a3"
                        />
                      </View>
                      <View style={[styles.inputInfoView]}>
                        <TextInput
                          name="uuid"
                          key="uuid"
                          style={[styles.TextInput, {width: '100%'}]}
                          value={info.uuid}
                          placeholder={item.uuid}
                          autoCorrect={false}
                          clearButtonMode="always"
                          onChangeText={value => handleInfo('uuid', value)}
                          placeholderTextColor="#6f6f6f"
                        />
                      </View>
                      <View style={[styles.inputInfoView]}>
                        <TextInput
                          name="building_name"
                          key="building_name"
                          style={[styles.TextInput, {width: '100%'}]}
                          value={info.building_name}
                          placeholder={item.building_name}
                          autoCorrect={false}
                          clearButtonMode="always"
                          onChangeText={value =>
                            handleInfo('building_name', value)
                          }
                          placeholderTextColor="#6f6f6f"
                        />
                      </View>
                    </View>
                    <View style={styles.overlayBtnContainer}>
                      <Btn
                        key="update"
                        title="Update"
                        buttonStyle={[
                          styles.overlayBtn,
                          {
                            backgroundColor: 'green',
                          },
                        ]}
                        onPress={() => {
                          uploadBlueprint();
                          toggleOverlay(idx);
                          getBlueprints();
                        }}
                      />
                      <Btn
                        key="cancel"
                        title="Cancel"
                        buttonStyle={[
                          styles.overlayBtn,
                          {
                            backgroundColor: 'red',
                          },
                        ]}
                        onPress={() => toggleOverlay(idx)}
                      />
                    </View>
                  </Overlay>

                  <ListItem.Swipeable
                    bottomDivider
                    leftContent={
                      <Btn
                        key="modify"
                        title="Modify"
                        icon={{name: 'auto-fix-high', color: 'white'}}
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'green',
                        }}
                        onPress={() => toggleOverlay(item, idx)}
                      />
                    }
                    rightContent={
                      <Btn
                        key="delete"
                        title="Delete"
                        icon={{name: 'delete', color: 'white'}}
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'red',
                        }}
                        onPress={() => deleteBlueprint(item)}
                      />
                    }>
                    {idx % 2 === 0 ? (
                      <FontAwesome name="building-o" size={30} />
                    ) : (
                      <FontAwesome name="building" size={30} />
                    )}
                    <ListItem.Content style={{alignItems: 'center'}}>
                      <ListItem.Title>
                        {item.building_name +
                          ' ' +
                          item.floor +
                          'F' +
                          '\n' +
                          item.uuid}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem.Swipeable>
                </>
              );
            })}
          </View>
        );
      // Taking the coordinates of each room.
      case 2:
        return (
          <View>
            {blueprints.map((item, idx) => {
              return (
                <>
                  <Overlay
                    isVisible={visibleIndex2 === idx}
                    onBackdropPress={() => toggleOverlay2(idx)}>
                    <TakeCoordinate
                      modifyCoordinate={modifyCoordinate}
                      toggleOverlay2={toggleOverlay2}
                      item={item}
                      idx={idx}
                    />
                  </Overlay>

                  <ListItem.Swipeable
                    bottomDivider
                    leftContent={
                      <Btn
                        key="coordinate"
                        title="Coordinate"
                        icon={{name: 'push-pin', color: 'white'}}
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'green',
                        }}
                        onPress={() => toggleOverlay2(idx)}
                      />
                    }
                    rightContent={
                      <Btn
                        key="delete"
                        title="Delete"
                        icon={{name: 'delete', color: 'white'}}
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'red',
                        }}
                        onPress={() => deleteBlueprint(item)}
                      />
                    }>
                    {idx % 2 === 0 ? (
                      <FontAwesome name="building-o" size={30} />
                    ) : (
                      <FontAwesome name="building" size={30} />
                    )}
                    <ListItem.Content style={{alignItems: 'center'}}>
                      <ListItem.Title>
                        {item.building_name +
                          ' ' +
                          item.floor +
                          'F' +
                          '\n' +
                          item.uuid}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem.Swipeable>
                </>
              );
            })}
          </View>
        );
      // set beacon's location for each floor
      case 3:
        return (
          <View>
            {blueprints.map((item, idx) => {
              return (
                <>
                  <Overlay
                    isVisible={visibleIndex3 === idx}
                    onBackdropPress={() => toggleOverlay3(idx)}>
                    <SetBeaconInfos
                      modifyBeaconInfos={modifyBeaconInfos}
                      toggleOverlay3={toggleOverlay3}
                      item={item}
                      idx={idx}
                    />
                  </Overlay>

                  <ListItem.Swipeable
                    bottomDivider
                    leftContent={
                      <Btn
                        key="set"
                        title="Set"
                        icon={{name: 'push-pin', color: 'white'}}
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'green',
                        }}
                        onPress={() => toggleOverlay3(idx)}
                      />
                    }
                    rightContent={
                      <Btn
                        key="delete"
                        title="Delete"
                        icon={{name: 'delete', color: 'white'}}
                        buttonStyle={{
                          minHeight: '100%',
                          backgroundColor: 'red',
                        }}
                        onPress={() => deleteBlueprint(item)}
                      />
                    }>
                    {idx % 2 === 0 ? (
                      <FontAwesome name="building-o" size={30} />
                    ) : (
                      <FontAwesome name="building" size={30} />
                    )}
                    <ListItem.Content style={{alignItems: 'center'}}>
                      <ListItem.Title>
                        {item.building_name +
                          ' ' +
                          item.floor +
                          'F' +
                          '\n' +
                          item.uuid}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem.Swipeable>
                </>
              );
            })}
          </View>
        );
      default:
        break;
    }
  };
  return (
    <SafeAreaView flex={1}>
      <ScrollView style={styles.AccList}>
        {accordionList.map((item, index) => {
          return (
            <ListItem.Accordion
              bottomDivider
              content={
                <>
                  <Icon
                    name={item.iconName}
                    size={30}
                    style={{marginRight: 20}}
                  />
                  <ListItem.Content key={item.title}>
                    <ListItem.Title>{item.title}</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={activeIndex === index}
              onPress={() => {
                handleAccordionClick(index);
              }}>
              {handleBlueprint(index)}
            </ListItem.Accordion>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const SignupScreen = ({navigation}) => {
  const {authContext, state} = React.useContext(AuthContext);
  const [account, setAccount] = React.useState({
    name: '',
    id: '',
    password: '',
    confirmPassword: '',
  });

  const handleAccount = (key, value) => {
    setAccount({
      ...account,
      [key]: value,
    });
  };

  return (
    <SafeAreaView flex={1}>
      <View style={styles.MainContainer}>
        <View>
          <Image
            source={logo}
            style={{
              height: 150,
              width: 150,
            }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            name="name"
            style={styles.TextInput}
            placeholder="Enter your Name"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={name => handleAccount('name', name)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            name="id"
            style={styles.TextInput}
            placeholder="Enter your ID"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={id => handleAccount('id', id)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            name="password"
            style={styles.TextInput}
            placeholder="
            Enter your Password"
            secureTextEntry={true}
            textContentType="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={password => handleAccount('password', password)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            name="confirmPassword"
            style={styles.TextInput}
            placeholder="
            Confirm your Password"
            secureTextEntry={true}
            textContentType="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={confirmPassword =>
              handleAccount('confirmPassword', confirmPassword)
            }
            placeholderTextColor="#282828"
          />
        </View>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() =>
            authContext.signup(account)
              ? navigation.navigate('LoginScreen')
              : {}
          }>
          <Text style={styles.loginText}>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export {HomeScreen, LoginScreen, BlueprintScreen, SignupScreen};
