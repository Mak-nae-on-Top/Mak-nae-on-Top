import * as React from 'react';
import {Image, View, Text} from 'react-native';
import bar from '../../images/Bar.png';

const DrawMap = ({location, blueprint}) => {
  if (blueprint === null) return <></>;

  return (
    <>
      <View>
        <Image style={{width: 300, height: 300}} source={{uri: blueprint}} />
      </View>
      <View>
        <Text>
          내 위치: {location[0].x}, {location[0].y}
        </Text>
      </View>
    </>
  );
};

export default DrawMap;
