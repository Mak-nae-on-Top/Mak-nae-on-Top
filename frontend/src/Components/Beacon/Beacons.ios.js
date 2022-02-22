import * as React from 'react';
import {NativeEventEmitter} from 'react-native';
import ImageSize from 'react-native-image-size';
import DrawMap from './DrawMap';

// import for beacon
import Kontakt, {KontaktModule} from 'react-native-kontaktio';
import {kswRegion} from './GetUuid';
import BeaconApiKey from './BeaconApiKey';
const {
  init,
  configure,
  // authorization
  requestWhenInUseAuthorization,
  // ranging
  startRangingBeaconsInRegion,
  getRangedRegions,
} = Kontakt;
const kontaktEmitter = new NativeEventEmitter(KontaktModule);

// import for server transmission
import axios from 'axios';
import {Url, SocketUrl} from '../../ServerURL/url';
import deviceInfo from '../GetDevice';

// import for auth context
import {AuthContext} from '../AuthContextProvider';

const RangingBeacon = props => {
  const {state} = React.useContext(AuthContext);

  // web socket
  const ws = React.useRef(null);
  const [isFired, setIsFired] = React.useState(false);

  // auth & beacon ranging
  const [ranging, setRanging] = React.useState(false);
  const [rangedBeacons, setRangedBeacons] = React.useState([]);
  const [rangedRegions, setRangedRegions] = React.useState([]);
  const [authStatus, setAuthStatus] = React.useState('');

  // server return value
  const [location, setLocation] = React.useState([]);
  const [floor, setFloor] = React.useState(null);
  const [uuid, setUuid] = React.useState(null);
  const [blueprint, setBlueprint] = React.useState(null);
  const [blueprintSize, setBlueprintSize] = React.useState({
    width: '',
    height: '',
  });

  // for initial beacon constant
  const [initLocation, setInitLocation] = React.useState({x: '', y: ''});
  const [initRangedBeacons, setInitRangedBeacons] = React.useState([]);
  const getInitLocation = location => {
    setInitLocation(location);
  };
  const beaconRef = React.useRef(initRangedBeacons);
  beaconRef.current = initRangedBeacons;

  // start accumulating beacons for 20 secs when user click blueprint
  React.useEffect(() => {
    const sendAccumulatedBeacons = () => {
      const timer = setTimeout(() => {
        initBeaconSetting(beaconRef.current);
        setInitRangedBeacons([]);
        setInitLocation({x: '', y: ''});
      }, 20000);
      return () => clearTimeout(timer);
    };
    initLocation.x !== '' && initLocation.y !== '' && sendAccumulatedBeacons();
  }, [initLocation]);
  React.useEffect(() => {
    const accumulateBeacons = () => {
      setInitRangedBeacons(initRangedBeacons => [
        ...initRangedBeacons,
        rangedBeacons,
      ]);
    };
    initLocation.x !== '' && initLocation.y !== '' && accumulateBeacons();
  }, [rangedBeacons]);

  // send accumulated beacons to server
  const initBeaconSetting = async accumulatedBeacons => {
    await axios
      .post(
        Url + 'app/manager/init',
        {
          x: initLocation.x,
          y: initLocation.y,
          rangedBeacons: accumulatedBeacons,
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
        console.log(response);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  };

  // Auth
  const handleRequestWhenInUseAuthorization = () => {
    requestWhenInUseAuthorization()
      .then(() => console.log('Requested when in use authorization!'))
      .catch(error =>
        console.log('Request When In Use Authorization Error : ', error),
      );
  };

  // Regions
  const handleGetRangedRegions = () => {
    getRangedRegions()
      .then(regions => {
        setRangedRegions(regions);
      })
      .then(() => console.log('Got ranged regions!'))
      .catch(error => console.log('Get Ranged Regions Error : ', error));
  };

  // Start beacon ranging
  const startRanging = () => {
    startRangingBeaconsInRegion(kswRegion)
      .then(() => {
        setRanging(true);
        setRangedBeacons([]);
      })
      .then(() => console.log('Started ranging beacons!'))
      .catch(error => console.log('Start ranging beacons error : ', error));
  };

  React.useEffect(() => {
    // Initialization, configuration and adding of beacon regions
    init(BeaconApiKey)
      .then(() =>
        configure({
          dropEmptyRanges: true,
          invalidationAge: 5000,
        }),
      )
      .then(() => handleRequestWhenInUseAuthorization())
      .then(() => {
        console.log('Initialized beacon ranging!');
      })
      .catch(error => console.log('error', error));

    // Beacon ranging event
    const regionRangeEvent = kontaktEmitter.addListener(
      'didRangeBeacons',
      ({beacons: rangedBeacons, region}) => {
        // delete didn't detected beacons & sort by distance
        const filteredBeacons = rangedBeacons
          .filter(beacon => beacon.proximity !== 'unknown')
          .sort((a, b) => a.accuracy - b.accuracy);

        // delete each beacon's useless information
        filteredBeacons.map(x => {
          delete x.proximity, delete x.rssi;
        });

        setRangedBeacons(filteredBeacons);
        setRangedRegions(region);
      },
    );

    const regionRangeFailEvent = kontaktEmitter.addListener(
      'rangingDidFailForRegion',
      ({region, error}) => {
        console.log('Ranging Did Fail For Region : ', region, error);
      },
    );

    // Auth event
    const authEvent = kontaktEmitter.addListener(
      'authorizationStatusDidChange',
      ({status}) => {
        setAuthStatus(status);
        console.log('Authorization Status Did Change : ', status);
      },
    );

    // Beacon event remove
    return () => {
      regionRangeEvent.remove();
      regionRangeFailEvent.remove();
      authEvent.remove();
    };
  }, []);

  //Start beacon ranging & getting ranged regions when auth changed
  React.useEffect(() => {
    startRanging();
    handleGetRangedRegions();
  }, [authStatus]);

  // get current user's location by sending information of beacons
  React.useEffect(() => {
    const getLocation = async () => {
      await axios
        .post(Url + 'app/location', rangedBeacons, {
          headers: {
            'Content-Type': 'application/json',
            Device: deviceInfo,
          },
        })
        .then(response => {
          console.log(response.data.location_list);
          if (response.data.status === 'success') {
            setLocation(response.data.location_list);
            setFloor(response.data.floor);
            setUuid(response.data.uuid);
          } else {
            setLocation([]);
            setFloor(null);
            setUuid(null);
          }
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    };
    ranging && rangedBeacons.length && getLocation();
  }, [rangedRegions]);

  // get current building's blueprint that user is in
  React.useEffect(() => {
    const loadBlueprint = async () => {
      await axios
        .post(
          Url + 'app/loadMap',
          {uuid: uuid, floor: floor},
          {
            headers: {
              Device: deviceInfo,
            },
          },
        )
        .then(response => {
          response.data.status === 'success' &&
            (setBlueprint(`data:image/jpeg;base64,${response.data.base64}`),
            ImageSize.getSize(
              `data:image/jpeg;base64,${response.data.base64}`,
            ).then(size => {
              setBlueprintSize({
                ...blueprintSize,
                width: size.width,
                height: size.height,
              });
            }));
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    };
    // load blueprint when floor & uuid is not null
    // send data to web socket server (case 1 : in the building / case 2 : not in the building)
    floor !== null && uuid !== null
      ? (loadBlueprint(), sendToWS({uuid: uuid, type: 'ENTER'}))
      : (setBlueprint(null), sendToWS({type: 'EXIT'}));
  }, [floor, uuid]);

  // connect with web socket server & send user's state to web socket server
  const sendToWS = data => {
    ws.current = new WebSocket(SocketUrl);
    // connect to web socket server
    ws.current.onopen = () => {
      try {
        // socket connection is required
        if (!ws.current) {
          // start connecting
          ws.current.connect();
          // resolve with false
          return Promise.resolve(false);
        }
        props.fireAlarmEnabled && ws.current.send(JSON.stringify(data));
        // resolve with true;
        return Promise.resolve(true);
      } catch (error) {
        // Handle error
        return Promise.resolve(false);
      }
    };
    return () => {
      ws.current.close();
    };
  };

  // get message indicating whether there is a fire in the building
  // where the user is currently located from websocket server
  React.useEffect(() => {
    const communicateWithWS = () => {
      ws.current.onmessage = e => {
        console.log(e.data);
        e.data === 'fire!' ? setIsFired(true) : setIsFired(false);
      };
    };
    blueprint !== null && communicateWithWS();
  }, [blueprint]);

  if (
    blueprintSize.width === '' ||
    blueprintSize.height === '' ||
    location[0] === undefined ||
    location === []
  )
    return <></>;
  return (
    <>
      <DrawMap
        getInitLocation={getInitLocation}
        destination={props.destination}
        floor={floor}
        uuid={uuid}
        location={location}
        blueprint={blueprint}
        blueprintSize={blueprintSize}
        isFired={isFired}
      />
    </>
  );
};

export default RangingBeacon;
