import React, {useEffect} from 'react';
import Home from './src/Routes/Home';
import {getUniqueId} from 'react-native-device-info';
import axios from 'axios';

const App = () => {
  const uniqueId = getUniqueId();

  //When starting application, hand over unique device's ID value
  useEffect(async () => {
    const postDeviceID = async () => {
      await axios
        .post(
          'http://3.19.6.82:8080/app/start',
          {deviceId: uniqueId},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    };

    postDeviceID();
  }, []);

  return <Home />;
};

export default App;
