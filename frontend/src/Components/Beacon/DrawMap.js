import * as React from 'react';
import {Image, View, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Svg, {Circle, Polyline} from 'react-native-svg';
import FireAlarm from '../FireAlarm';

// import for server transmission
import axios from 'axios';
import {Url} from '../../ServerURL/url';
import deviceInfo from '../GetDevice';

// import for auth context
import {AuthContext} from '../AuthContextProvider';

// user's cellphone size
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const DrawMap = props => {
  const {state} = React.useContext(AuthContext);

  if (props.blueprint === null) return <></>;
  const ratio = windowHeight / Number(props.blueprintSize.height);
  const [polyline, setPolyline] = React.useState('');

  const initBeaconSetting = (x, y) => {
    // send clicked location to Beacons.ios.js when user is logged in
    state.userToken != null && props.getInitLocation({x: x, y: y});
  };

  // send destination to server and get optimal route to destination
  React.useEffect(() => {
    const getOptimalRoute = async dst => {
      await axios
        .post(
          Url + 'app/loadRoute',
          {uuid: props.uuid, floor: props.floor, destination: dst},
          {
            headers: {
              'Content-Type': 'application/json',
              Device: deviceInfo,
            },
          },
        )
        .then(response => {
          if (response.data) {
            let polyline = '';
            response.data.map(coor => {
              return (polyline += `${coor.x * ratio},${coor.y * ratio} `);
            });
            setPolyline(polyline);
          } else {
            setPolyline('');
          }
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    };
    // case 1 : when fire situation, destination is exit
    // case 2 : when normal situation, destination is user's choice
    props.isFired
      ? getOptimalRoute('exit')
      : props.destination &&
        props.destination !== '' &&
        getOptimalRoute(props.destination);
  }, [props.destination, props.isFired]);

  return (
    <>
      {props.isFired ? <FireAlarm /> : <></>}
      <ImageZoom
        cropWidth={windowWidth}
        cropHeight={windowHeight}
        imageWidth={Number(props.blueprintSize.width) * ratio}
        imageHeight={windowHeight}
        minScale={1}
        enableCenterFocus={false}
        onClick={e => initBeaconSetting(e.locationX, e.locationY)}>
        {/* blueprint */}
        <View style={{position: 'absolute', zIndex: 1}}>
          <Image
            style={{
              width: Number(props.blueprintSize.width) * ratio,
              height: windowHeight,
            }}
            source={{uri: props.blueprint}}
            resizeMode="stretch"
          />
        </View>
        <View style={{position: 'absolute', zIndex: 2}}>
          <Svg
            height={windowHeight}
            width={Number(props.blueprintSize.width) * ratio}
            viewBox={`0 0 ${
              Number(props.blueprintSize.width) * ratio
            } ${windowHeight}`}>
            {/* user's current location */}
            <Circle
              cx={Number(props.location[0].x) * ratio}
              cy={Number(props.location[0].y) * ratio}
              r="10"
              stroke="black"
              strokeWidth="0.5"
              fill="red"
            />
            {/* other user's current location */}
            {props.location.slice(1).map(loc => {
              return (
                <Circle
                  key={loc}
                  cx={Number(loc.x) * ratio}
                  cy={Number(loc.y) * ratio}
                  r="7"
                  stroke="black"
                  strokeWidth="0.5"
                  fill="blue"
                />
              );
            })}
            {/* destination */}
            {polyline !== '' && (
              <Polyline points={polyline} stroke="red" strokeWidth="8" />
            )}
          </Svg>
        </View>
      </ImageZoom>
    </>
  );
};

export default DrawMap;
