import React, {useState, useEffect} from 'react';
import {Text, View, NativeEventEmitter} from 'react-native';

import Kontakt, {KontaktModule} from 'react-native-kontaktio';

const {
  init,
  configure,
  // authorization
  requestWhenInUseAuthorization,
  // ranging
  startRangingBeaconsInRegion,
  getRangedRegions,
} = Kontakt;

const styles = StyleSheet.create({
  beaconView: {
    // justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
});

const kontaktEmitter = new NativeEventEmitter(KontaktModule);
const region1 = {
  identifier: 'Test beacons 1',
  uuid: '74278BDA-B644-4520-8F0C-720EAF059935',
  //   major: 1,
};

// const region2 = {
//   identifier: 'Test beacons 2',
//   uuid: 'B0702880-A295-A8AB-F734-031A98A512DE',
//   major: 2,
// };

const RangingBeacon = () => {
  const [ranging, setRanging] = useState(false);
  const [rangedBeacons, setRangedBeacons] = useState([]);
  const [rangedRegions, setRangedRegions] = useState([]);
  const [authStatus, setAuthStatus] = useState('');

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
      rangedBeacons
        .sort((a, b) => a.accuracy - b.accuracy)
        .map((beacon, index) => (
          <View key={index} style={[styles.beaconView]}>
            <Text style={{fontWeight: 'bold'}}>{beacon.uuid}</Text>
            <Text>Distance: {beacon.accuracy}</Text>
            <Text>
              Major: {beacon.major}, Minor: {beacon.minor}
            </Text>
            <Text>
              RSSI: {beacon.rssi}, Proximity: {beacon.proximity}
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

  useEffect(() => {
    // Initialization, configuration and adding of beacon regions
    init('WGRsFuKslnKIhkfCmLZzHrovqgKMPfmx')
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
        setRangedBeacons(rangedBeacons);
        setRangedRegions(region);
        console.log('Did Range Beacons : ', rangedBeacons, region);
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
  useEffect(() => {
    startRanging();
    handleGetRangedRegions();
  }, [authStatus]);

  return renderRangedBeacons();
};

export default RangingBeacon;
