import React, {useState} from 'react';
import {View} from 'react-native';
import SideBar from '../Components/SideBar';

const Home = () => {
  const [parentHeight, setParentHeight] = useState(0);

  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    setParentHeight(height);
  };
  return (
    <View
      style={{height: '100%', width: '100%', backgroundColor: '#000000'}}
      onLayout={onLayout}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: parentHeight,
          backgroundColor: 'white',
        }}>
        <SideBar />
      </View>
    </View>
  );
};

export default Home;
