import React, {useState, useCallback} from 'react';
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
  TextInput,
} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import 'react-native-gesture-handler';
import {Searchbar} from 'react-native-paper';
import SlidingUpPanel from 'rn-sliding-up-panel';
import bar from '../images/Bar.png';
import logo from '../images/Logo.png';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Beacon from '../Components/Beacons.ios.js';
import UploadBtn from '../Components/Blueprint/UploadBtn';
import UploadResponse from '../Components/Blueprint/UploadResponse';

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
    backgroundColor: '#E6E6E6',
    alignSelf: 'flex-start',
    marginHorizontal: '3%',
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
    color: '#282828',
    textAlign: 'center',
  },
  padding: {
    padding: 10,
    paddingTop: 20,
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
  },
  inputView: {
    backgroundColor: '#D4D4D4',
    borderRadius: 30,
    width: '80%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
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
  // AccContainer: {
  // paddingTop: 10,
  // },
  uploadBtnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  ResponseImage: {
    marginVertical: 24,
    alignItems: 'center',
  },
  UploadSuccessContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const HomeScreen = ({locationEnabled}) => {
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
              borderRadius: 10,
              tintColor: '#707070',
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
        {locationEnabled ? (
          <Beacon />
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

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
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
            placeholder="Enter your E-mail"
            onChangeText={email => setEmail(email)}
            placeholderTextColor="#282828"
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="
            Enter your Password"
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.loginText}>SIGNUP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn}>
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
  const [response, setResponse] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeIndex, setActiveIndex] = useState();

  const includeExtra = true;

  const accordionList = [
    {
      title: 'Upload Blueprint',
      iconName: 'map',
    },
    {
      title: 'Uploaded Bluprint List',
      iconName: 'list',
    },
    {
      title: 'Needs to be fixed',
      iconName: 'warning',
    },
  ];

  const actions = [
    {
      title: 'Take Blueprint',
      type: 'capture',
      options: {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: false,
        includeExtra,
      },
    },
    {
      title: 'Select Blueprint',
      type: 'library',
      options: {
        maxHeight: 200,
        maxWidth: 200,
        selectionLimit: 0,
        mediaType: 'photo',
        includeBase64: false,
        includeExtra,
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

  const handleGetBlueprintBtn = useCallback((type, options) => {
    if (type === 'capture') {
      launchCamera(options, setResponse);
    } else {
      launchImageLibrary(options, setResponse);
    }
  }, []);

  const handleChosenBlueprintBtn = useCallback(type => {
    if (type === 'upload') {
      // todo : image upload to database

      setUploadSuccess(true);
      setResponse(null);
    } else {
      setUploadSuccess(false);
      setResponse(null);
    }
  }, []);

  const handleAccordionClick = index => {
    activeIndex === index ? setActiveIndex(null) : setActiveIndex(index);
  };

  return (
    <SafeAreaView flex={1}>
      <View style={styles.AccList}>
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
                  <ListItem.Content>
                    <ListItem.Title>{item.title}</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={activeIndex === index}
              onPress={() => {
                handleAccordionClick(index);
              }}>
              {/* Upload Blueprint */}
              {index === 0 && (
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

                  {/* Images that user choose */}
                  {response?.assets &&
                    response?.assets.map(({uri}) => (
                      <View key={uri} style={styles.ResponseImage}>
                        <Image
                          resizeMode="cover"
                          resizeMethod="scale"
                          style={{width: 200, height: 200}}
                          source={{uri: uri}}
                        />
                      </View>
                    ))}

                  {uploadSuccess ? (
                    <View style={styles.UploadSuccessContainer}>
                      <Text
                        style={{
                          fontSize: 30,
                          fontWeight: 'bold',
                          marginTop: 20,
                        }}>
                        Successfully Uploaded
                      </Text>
                    </View>
                  ) : (
                    []
                  )}

                  {/* Upload Btn & Delete Btn */}
                  {response ? (
                    !response.didCancel ? (
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
                    ) : (
                      []
                    )
                  ) : (
                    []
                  )}
                </>
              )}

              {/* Uploaded Blueprint List */}
              {index === 1 && (
                <>{/* todo : Get user's blueprint list from database */}</>
              )}

              {/* List that needs to be fixed */}
              {index === 2 && (
                <>
                  {/* todo : Get user's blueprint list that needs to be fixed from database */}
                </>
              )}
            </ListItem.Accordion>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
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
            style={styles.TextInput}
            placeholder="Enter your Name"
            onChangeText={name => setName(name)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter your E-mail"
            onChangeText={email => setEmail(email)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="
            Enter your Password"
            secureTextEntry={true}
            onChangeText={password => setPassword(password)}
            placeholderTextColor="#282828"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="
            Re-enter your Password"
            secureTextEntry={true}
            onChangeText={password2 => setPassword2(password2)}
            placeholderTextColor="#282828"
          />
        </View>
        <TouchableOpacity style={styles.registerBtn}>
          <Text style={styles.loginText}>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export {HomeScreen, LoginScreen, BlueprintScreen, SignupScreen};
