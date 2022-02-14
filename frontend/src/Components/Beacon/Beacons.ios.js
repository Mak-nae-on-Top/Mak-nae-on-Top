import * as React from 'react';
import {StyleSheet, Text, View, NativeEventEmitter} from 'react-native';

import Kontakt, {KontaktModule} from 'react-native-kontaktio';
import {regionSample, GetUuid} from './GetUuid';
import axios from 'axios';

import BeaconApiKey from './BeaconApiKey';
import url from '../../ServerURL/url';
import deviceInfo from '../GetDevice';
import DrawMap from './DrawMap';

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
const region1 = regionSample;

const RangingBeacon = () => {
  const [ranging, setRanging] = React.useState(false);
  const [rangedBeacons, setRangedBeacons] = React.useState([]);
  const [rangedRegions, setRangedRegions] = React.useState([]);
  const [authStatus, setAuthStatus] = React.useState('');

  const [location, setLocation] = React.useState([]);
  const [floor, setFloor] = React.useState(null);
  const [uuid, setUuid] = React.useState(null);

  const [blueprint, setBlueprint] = React.useState(null);
  const [blueprintSize, setBlueprintSize] = React.useState({
    width: '',
    height: '',
  });
  const [imageSize, setImageSize] = React.useState({width: '', height: ''});

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

  // Rendering ranged beacons(sort by close distance)
  const renderRangedBeacons = () => {
    return ranging && rangedBeacons.length ? (
      rangedBeacons.map((beacon, index) => (
        <View key={index} style={[styles.beaconView]}>
          <Text style={{fontWeight: 'bold'}}>{beacon.uuid}</Text>
          <Text>Distance: {beacon.accuracy}</Text>
          <Text>
            Major: {beacon.major}, Minor: {beacon.minor}
          </Text>
        </View>
      ))
    ) : (
      <View>
        <Text>No beacons detected within the range</Text>
      </View>
    );
  };

  // Start beacon ranging
  const startRanging = () => {
    startRangingBeaconsInRegion(region1)
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
        // console.log('Did Range Beacons : ', rangedBeacons, region);
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

    //Beacon event remove
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
        .post(
          url + 'app/location',
          // rangedBeacons,
          [
            {
              uuid: 'testuuid',
              major: '01',
              minor: '01',
              accuracy: 3.87,
            },
            {
              uuid: 'testuuid',
              major: '02',
              minor: '02',
              accuracy: 3.3,
            },
            {
              uuid: 'testuuid',
              major: '03',
              minor: '03',
              accuracy: 2.53,
            },
          ],
          {
            headers: {
              'Content-Type': 'application/json',
              Device: deviceInfo,
            },
          },
        )
        .then(response => {
          setLocation(response.data.locationList);
          setFloor(response.data.floor);
          setUuid(response.data.uuid);
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    };
    ranging && rangedBeacons.length ? getLocation() : {};
  }, [rangedRegions]);

  // get current building's blueprint that user is in
  React.useEffect(() => {
    const loadBlueprint = async () => {
      await axios
        .post(
          url + 'app/loadMap',
          {uuid: uuid, floor: floor},
          {
            headers: {
              Device: 'testDeviceID',
              // Device: deviceInfo,
            },
          },
        )
        .then(response => {
          response.data.status === 'success' &&
            (setBlueprint(`data:image/jpeg;base64,${response.data.base64}`),
            setBlueprintSize({
              ...blueprintSize,
              width: response.data.blueprint_width,
              height: response.data.blueprint_height,
            }),
            setImageSize({
              ...imageSize,
              width: response.data.image_width,
              height: response.data.image_height,
            }));
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    };
    // load blueprint when floor & uuid is not null
    floor !== null && uuid !== null && loadBlueprint();
  }, [floor, uuid]);

  if (
    blueprintSize.width === '' ||
    blueprintSize.height === '' ||
    imageSize.width === '' ||
    imageSize.height === '' ||
    location[0].x === '' ||
    location[0].y === ''
  )
    return <></>;
  return (
    <>
      <DrawMap
        location={location}
        blueprint={blueprint}
        blueprintSize={blueprintSize}
        imageSize={imageSize}
      />
    </>
  );
};

const styles = StyleSheet.create({
  beaconView: {
    alignItems: 'center',
    padding: 10,
  },
});

export default RangingBeacon;
