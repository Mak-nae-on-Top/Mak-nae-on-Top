import * as React from 'react';
import axios from 'axios';
import {Image, View, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Svg, {Circle, Path, Marker, Polyline} from 'react-native-svg';
import BottomBar from '../BottomBar';
import FireAlarm from '../FireAlarm';

import {Url} from '../../ServerURL/url';
import deviceInfo from '../GetDevice';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const DrawMap = ({
  floor,
  uuid,
  location,
  blueprint,
  blueprintSize,
  isFired,
}) => {
  if (blueprint === null) return <></>;
  const ratio = windowHeight / Number(blueprintSize.height);

  React.useEffect(() => {
    isFired && setDestination('exit');
  }, [isFired]);

  const [polyline, setPolyline] = React.useState('');

  const [destination, setDestination] = React.useState('');
  const getDestination = dst => {
    setDestination(dst);
  };

  React.useEffect(() => {
    const getOptimalRoute = async () => {
      await axios
        .post(
          Url + 'app/loadRoute',
          {uuid: uuid, floor: floor, destination: destination},
          {
            headers: {
              'Content-Type': 'application/json',
              Device: deviceInfo,
            },
          },
        )
        .then(response => {
          alert(response.data.message);
          if (response.data.status === 'success') {
            let polyline = '';
            response.data.coordinates.map(coor => {
              return (polyline += `${coor[0]},${coor[1]}`);
            });
            setPolyline(polyline);
          } else {
            setPolyline('');
          }
          setDestination('');
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    };
    destination !== '' && getOptimalRoute();
  }, [destination]);

  return (
    <>
      {isFired ? <FireAlarm /> : <BottomBar getDestination={getDestination} />}
      <ImageZoom
        cropWidth={windowWidth}
        cropHeight={windowHeight}
        imageWidth={Number(blueprintSize.width) * ratio}
        imageHeight={windowHeight}
        minScale={1}
        enableCenterFocus={false}>
        <View style={{position: 'absolute', zIndex: 1}}>
          <Image
            style={{
              width: Number(blueprintSize.width) * ratio,
              height: windowHeight,
            }}
            source={{uri: blueprint}}
            resizeMode="stretch"
          />
        </View>
        <View style={{position: 'absolute', zIndex: 2}}>
          <Svg
            height={windowHeight}
            width={
              (windowHeight / Number(blueprintSize.height)) *
              Number(blueprintSize.width)
            }
            viewBox={`0 0 ${
              (windowHeight / Number(blueprintSize.height)) *
              Number(blueprintSize.width)
            } ${windowHeight}`}>
            <Circle
              cx={
                (Number(location[0].x) * windowHeight) /
                Number(blueprintSize.width)
              }
              cy={
                (Number(location[0].y) * windowHeight) /
                Number(blueprintSize.height)
              }
              r="10"
              stroke="black"
              strokeWidth="0.5"
              fill="red"
            />
            {location.slice(1).map(loc => {
              return (
                <Circle
                  cx={
                    (Number(loc.x) * windowHeight) / Number(blueprintSize.width)
                  }
                  cy={
                    (Number(loc.y) * windowHeight) /
                    Number(blueprintSize.height)
                  }
                  r="7"
                  stroke="black"
                  strokeWidth="0.5"
                  fill="blue"
                />
              );
            })}
            {destination !== '' && (
              <>
                <Marker
                  id="Triangle"
                  viewBox="0 0 10 10"
                  refX="0"
                  refY="5"
                  p
                  markerUnits="strokeWidth"
                  markerWidth="4"
                  markerHeight="3"
                  orient="auto">
                  <Path d="M 0 0 L 10 5 L 0 10 z" />
                </Marker>
                <Polyline
                  points={polyline}
                  fill="red"
                  stroke="red"
                  strokeWidth="3"
                  markerEnd="url(#Triangle)"
                />
              </>
            )}
          </Svg>
        </View>
      </ImageZoom>
    </>
  );
};

export default DrawMap;
