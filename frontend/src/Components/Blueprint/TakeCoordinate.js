import * as React from 'react';
import {Image, View, Dimensions, TextInput} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Svg, {Circle, G, Text as SvgText} from 'react-native-svg';
import {BottomSheet, ListItem, SpeedDial} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ImageSize from 'react-native-image-size';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TakeCoordinate = props => {
  const [blueprintSize, setBlueprintSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    ImageSize.getSize(`data:image/jpeg;base64,${props.item.base64}`).then(
      size => {
        setBlueprintSize({width: size.width, height: size.height});
      },
    );
  }, []);

  const [coordinates, setCoordinates] = React.useState(props.item.coordinate);
  const [modifiedCoordinates, setModifiedCoordinates] = React.useState([]);
  const [dialOpen, setDialOpen] = React.useState(false);

  const [roomName, setRoomName] = React.useState();
  const [modifiedCoordinate, setModifiedCoordinate] = React.useState();
  const handleModifiedCoordinate = (key, value) => {
    if (key === 'x' || key === 'y') {
      value = Number(value);
    }
    setModifiedCoordinate({
      ...modifiedCoordinate,
      [key]: value,
    });
  };

  // for delivered coordinate's bottom sheet showing
  const [visibleIndex, setVisibleIndex] = React.useState();
  const toggleVisibleIndex = idx => {
    visibleIndex === idx && idx !== null
      ? setVisibleIndex(null)
      : setVisibleIndex(idx);
  };

  // for new coordinate's bottom sheet showing
  const [visiblePoint, setVisiblePoint] = React.useState({x: '', y: ''});
  const toggleVisiblePoint = (x, y) => {
    // adjusting the screen proportion.
    x = (x / windowHeight) * blueprintSize.width;
    y = (y / windowHeight) * blueprintSize.height;
    setLocation({x: x, y: y});
    visiblePoint.x === x && visiblePoint.y === y && x !== '' && y !== ''
      ? setVisiblePoint({...visiblePoint, x: '', y: ''})
      : setVisiblePoint({...visiblePoint, x: x, y: y});
  };
  const [location, setLocation] = React.useState({x: '', y: ''});

  // draw delivered coordinate's bottom sheet
  const drawBottomSheet = (value, idx) => {
    const sheetList = [
      {
        containerStyle: {
          backgroundColor: 'white',
          height: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      },
      {title: `Origin X : ${value.x}`, key: 'x', style: {fontSize: 20}},
      {title: `Origin Y : ${value.y}`, key: 'y', style: {fontSize: 20}},
      {
        title: `Origin Room Name : ${value.room_name}`,
        key: 'room_name',
        style: {fontSize: 20},
      },
      {
        title: 'Apply',
        containerStyle: {backgroundColor: '#3bc219'},
        titleStyle: {color: 'white', fontSize: 30, fontWeight: 'bold'},
        onPress: () => {
          handleApplyBtn({...modifiedCoordinate, id: value.id}),
            setVisibleIndex(null);
        },
      },
      {
        title: 'Cancel',
        containerStyle: {backgroundColor: '#ff2121'},
        titleStyle: {color: 'white', fontSize: 30, fontWeight: 'bold'},
        onPress: () => {
          setVisibleIndex(null);
        },
      },
    ];
    return (
      <SafeAreaProvider>
        <BottomSheet
          modalProps={{
            animationType: 'fade',
            hardwareAccelerated: true,
          }}
          isVisible={visibleIndex === idx}>
          {sheetList.map((val, index) => (
            <ListItem
              bottomDivider
              key={index}
              containerStyle={[{height: 80}, val.containerStyle]}
              onPress={val.onPress}>
              <ListItem.Content>
                {index === 0 ? (
                  <ListItem.Title></ListItem.Title>
                ) : index < 4 ? (
                  <TextInput
                    style={val.style}
                    // value={String(modifiedCoordinate[val.key])}
                    placeholder={val.title}
                    autoCorrect={false}
                    onChangeText={value =>
                      handleModifiedCoordinate(val.key, value)
                    }
                    placeholderTextColor="#999999"
                  />
                ) : (
                  <ListItem.Title style={val.titleStyle}>
                    {val.title}
                  </ListItem.Title>
                )}
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
      </SafeAreaProvider>
    );
  };

  // draw new coordinate's bottom sheet
  const drawBottomSheet2 = () => {
    const sheetList = [
      {
        title: ' ',
        containerStyle: {
          backgroundColor: 'white',
          height: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      },
      {title: `X : ${location.x}`, key: 'x', style: {fontSize: 20}},
      {title: `Y : ${location.y}`, key: 'y', style: {fontSize: 20}},
      {
        title: 'Type Room Name',
        key: 'room_name',
        style: {fontSize: 20},
      },
      {
        title: 'Apply',
        containerStyle: {backgroundColor: '#3bc219'},
        titleStyle: {color: 'white', fontSize: 30, fontWeight: 'bold'},
        onPress: () => {
          handleApplyBtn({x: location.x, y: location.y, room_name: roomName}),
            setVisiblePoint({...visiblePoint, x: '', y: ''}),
            setRoomName('');
        },
      },
      {
        title: 'Cancel',
        containerStyle: {backgroundColor: '#ff2121'},
        titleStyle: {color: 'white', fontSize: 30, fontWeight: 'bold'},
        onPress: () => {
          setVisiblePoint({...visiblePoint, x: '', y: ''}), setRoomName('');
        },
      },
    ];
    return (
      <SafeAreaProvider>
        <BottomSheet
          modalProps={{
            animationType: 'fade',
            hardwareAccelerated: true,
          }}
          isVisible={
            visiblePoint.x === location.x &&
            visiblePoint.y === location.y &&
            (location.x !== '' || location.y !== '')
          }>
          {sheetList.map((val, index) => (
            <ListItem
              bottomDivider
              key={index}
              containerStyle={[{height: 80}, val.containerStyle]}
              onPress={val.onPress}>
              <ListItem.Content>
                {index !== 3 ? (
                  <ListItem.Title style={val.titleStyle}>
                    {val.title}
                  </ListItem.Title>
                ) : (
                  <TextInput
                    style={val.style}
                    value={roomName}
                    placeholder={val.title}
                    autoCorrect={false}
                    onChangeText={name => setRoomName(name)}
                    placeholderTextColor="#999999"
                  />
                )}
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
      </SafeAreaProvider>
    );
  };

  // drawing all coordinates
  const drawCoordinates = (value, idx) => {
    const x = Number(value.x);
    const y = Number(value.y);
    const width = Number(blueprintSize.width);
    const height = Number(blueprintSize.height);
    return (
      <G onPress={() => toggleVisibleIndex(idx)}>
        {drawBottomSheet(value, idx)}
        <SvgText
          fill="grey"
          stroke="black"
          strokeWidth="0.3"
          fontSize="15"
          fontWeight="bold"
          x={(x * windowHeight) / width}
          y={(y * windowHeight) / height + 30}
          textAnchor="middle">
          {value.room_name}
        </SvgText>
        <Circle
          cx={(x * windowHeight) / width}
          cy={(y * windowHeight) / height}
          r="15"
          stroke="black"
          strokeWidth="0.5"
          fill="grey"
        />
      </G>
    );
  };

  const handleApplyBtn = modifiedCoordinate => {
    // add new coordinate case
    if (modifiedCoordinate.id === undefined) {
      modifiedCoordinates.length !== 0
        ? setModifiedCoordinates(modifiedCoordinates => [
            ...modifiedCoordinates,
            modifiedCoordinate,
          ])
        : setModifiedCoordinates([modifiedCoordinate]);
      return;
    }

    // modify coordinate case
    const temp = [];
    modifiedCoordinates.find(MC => MC.id === modifiedCoordinate.id)
      ? {}
      : temp.push(modifiedCoordinate);
    modifiedCoordinates.map(MC => {
      if (MC.id === undefined) {
        temp.push(MC);
      } else {
        MC.id !== modifiedCoordinate.id
          ? temp.push(MC)
          : temp.push(modifiedCoordinate);
      }
    });
    setModifiedCoordinates(temp);

    // rendering value
    const temp2 = [];
    coordinates.map(coor => {
      coor.id !== modifiedCoordinate.id
        ? temp2.push(coor)
        : temp2.push(modifiedCoordinate);
    });
    setCoordinates(temp2);
  };

  // transfer all modified information
  const handleSaveBtn = () => {
    props.modifyCoordinate(
      props.item.uuid,
      props.item.floor,
      modifiedCoordinates,
      props.idx,
    );
  };

  return (
    <>
      {blueprintSize.height !== 0 ? (
        <>
          <SpeedDial
            style={{paddingRight: 20, zIndex: 100}}
            isOpen={dialOpen}
            icon={{name: 'edit', color: '#fff'}}
            openIcon={{name: 'close', color: '#fff'}}
            onOpen={() => setDialOpen(!dialOpen)}
            onClose={() => setDialOpen(!dialOpen)}>
            <SpeedDial.Action
              icon={{name: 'save', color: '#fff'}}
              title="Save"
              onPress={() => handleSaveBtn()}
            />
            <SpeedDial.Action
              icon={{name: 'cancel', color: '#fff'}}
              title="Cancel"
              onPress={() => props.toggleOverlay2(props.idx)}
            />
          </SpeedDial>
          <ImageZoom
            cropWidth={windowWidth}
            cropHeight={windowHeight}
            imageWidth={
              (Number(blueprintSize.width) * windowHeight) /
              Number(blueprintSize.height)
            }
            imageHeight={windowHeight}
            minScale={1}
            enableCenterFocus={false}
            onClick={e => toggleVisiblePoint(e.locationX, e.locationY)}>
            {drawBottomSheet2()}
            <View style={{position: 'absolute', zIndex: 1}}>
              <Image
                style={{
                  width:
                    (Number(blueprintSize.width) * windowHeight) /
                    Number(blueprintSize.height),
                  height: windowHeight,
                }}
                source={{uri: `data:image/jpeg;base64,${props.item.base64}`}}
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
                {coordinates !== undefined &&
                  coordinates.map((value, idx) => {
                    return drawCoordinates(value, idx);
                  })}
              </Svg>
            </View>
          </ImageZoom>
        </>
      ) : (
        <View></View>
      )}
    </>
  );
};

export default TakeCoordinate;
