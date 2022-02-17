import * as React from 'react';
import {Image, View, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Svg, {Circle, G, Text as SvgText} from 'react-native-svg';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TakeCoordinate = ({modifyCoordinate, item, idx}) => {
  console.log('!!!!' + item.image_height + '!!!' + item.image_width);
  const ratio = windowHeight / Number(item.image_height);
  //   if (blueprint === null) return <></>;
  const [coordinates, setCoordinates] = React.useState(item.coordinate);

  const takeCoordinate = () => {
    //모달 창 띄우고 화장실, 방 이름 등 이름 입력하고, 버튼 누르면 setCoodinates
  };

  const handleCoordinate = () => {
    //모달 창 띄우고 정보 보여주고, 삭제 또는 수정
  };

  // 완료 버튼 눌렀을 시
  const handleModifyBtn = () => {
    modifyCoordinate(coordinates, idx);
  };

  const handleCancelBtn = () => {};

  return (
    <>
      <ImageZoom
        cropWidth={windowWidth}
        cropHeight={windowHeight}
        imageWidth={Number(item.image_width) * ratio}
        imageHeight={windowHeight}
        minScale={1}
        enableCenterFocus={false}>
        <View style={{position: 'absolute', zIndex: 1}}>
          <Image
            style={{
              width: Number(item.image_width) * ratio,
              height: windowHeight,
            }}
            source={{uri: `data:image/jpeg;base64,${item.base64}`}}
            resizeMode="stretch"
          />
        </View>
        <View style={{position: 'absolute', zIndex: 2}}>
          <Svg
            height={windowHeight}
            width={
              (windowHeight / Number(item.blueprint_height)) *
              Number(item.blueprint_width)
            }
            viewBox={`0 0 ${
              (windowHeight / Number(item.blueprint_height)) *
              Number(item.blueprint_width)
            } ${windowHeight}`}>
            {coordinates !== undefined &&
              coordinates.map(value => {
                return (
                  <G onPress={() => alert('touch circle')}>
                    <SvgText
                      fill="grey"
                      stroke="black"
                      strokeWidth="0.3"
                      fontSize="15"
                      fontWeight="bold"
                      x={
                        (Number(value.x) * windowHeight) /
                        Number(item.blueprint_width)
                      }
                      y={
                        (Number(value.y) * windowHeight) /
                          Number(item.blueprint_height) +
                        30
                      }
                      textAnchor="middle">
                      {value.roomName}
                    </SvgText>
                    <Circle
                      cx={
                        (Number(value.x) * windowHeight) /
                        Number(item.blueprint_width)
                      }
                      cy={
                        (Number(value.y) * windowHeight) /
                        Number(item.blueprint_height)
                      }
                      r="15"
                      stroke="black"
                      strokeWidth="0.5"
                      fill="grey"
                    />
                  </G>
                );
              })}
          </Svg>
        </View>
      </ImageZoom>
    </>
  );
};

export default TakeCoordinate;
