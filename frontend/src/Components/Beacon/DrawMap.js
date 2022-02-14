import * as React from 'react';
import {Image, View, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Svg, {Circle} from 'react-native-svg';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const DrawMap = ({location, blueprint, blueprintSize, imageSize}) => {
  if (blueprint === null) return <></>;
  const ratio = windowHeight / Number(imageSize.height);
  return (
    <>
      <ImageZoom
        cropWidth={windowWidth}
        cropHeight={windowHeight}
        imageWidth={Number(imageSize.width) * ratio}
        imageHeight={windowHeight}
        minScale={1}
        enableCenterFocus={false}>
        <View style={{position: 'absolute', zIndex: 1}}>
          <Image
            style={{
              width: Number(imageSize.width) * ratio,
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
          </Svg>
        </View>
      </ImageZoom>
    </>
  );
};

export default DrawMap;
