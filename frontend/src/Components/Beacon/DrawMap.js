import * as React from 'react';
import axios from 'axios';
import {Image, View, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Svg, {Circle, Polyline} from 'react-native-svg';
import FireAlarm from '../FireAlarm';

import {Url} from '../../ServerURL/url';
import deviceInfo from '../GetDevice';
import {AuthContext} from '../AuthContextProvider';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const DrawMap = props => {
  const {state} = React.useContext(AuthContext);

  if (props.blueprint === null) return <></>;
  const ratio = windowHeight / Number(props.blueprintSize.height);

  const [polyline, setPolyline] = React.useState('');

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
          console.log(response);
          if (response.data.status === 'success') {
            let polyline = '';
            response.data.coordinates.map(coor => {
              return (polyline += `${coor.x},${coor.y} `);
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
    props.isFired
      ? getOptimalRoute('exit')
      : props.destination &&
        props.destination !== '' &&
        getOptimalRoute(props.destination);
  }, [props.destination, props.isFired]);

  const initBeaconSetting = (x, y) => {
    state.userToken != null && props.getInitLocation({x: x, y: y});
  };

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
            width={
              (windowHeight / Number(props.blueprintSize.height)) *
              Number(props.blueprintSize.width)
            }
            viewBox={`0 0 ${
              (windowHeight / Number(props.blueprintSize.height)) *
              Number(props.blueprintSize.width)
            } ${windowHeight}`}>
            <Circle
              cx={
                (Number(props.location[0].x) * windowHeight) /
                Number(props.blueprintSize.width)
              }
              cy={
                (Number(props.location[0].y) * windowHeight) /
                Number(props.blueprintSize.height)
              }
              r="10"
              stroke="black"
              strokeWidth="0.5"
              fill="red"
            />
            {props.location.slice(1).map(loc => {
              return (
                <Circle
                  key={loc}
                  cx={
                    (Number(loc.x) * windowHeight) /
                    Number(props.blueprintSize.width)
                  }
                  cy={
                    (Number(loc.y) * windowHeight) /
                    Number(props.blueprintSize.height)
                  }
                  r="7"
                  stroke="black"
                  strokeWidth="0.5"
                  fill="blue"
                />
              );
            })}
            {polyline !== '' && (
              <Polyline
                points={polyline}
                fill="red"
                stroke="red"
                strokeWidth="8"
              />
            )}
          </Svg>
        </View>
      </ImageZoom>
    </>
  );
};

export default DrawMap;
