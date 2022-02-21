import React from 'react';
import Home from './src/Routes/Home';
import {AuthContextProvider} from './src/Components/AuthContextProvider';

const App = () => {
  return (
    <AuthContextProvider>
      <Home />
    </AuthContextProvider>
  );
};

export default App;
