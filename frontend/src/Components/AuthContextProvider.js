import * as React from 'react';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {Url} from '../ServerURL/url';

// create context
const AuthContext = React.createContext();

const AuthContextProvider = ({children}) => {
  console.log(children);
  // to manage auth status
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            id: action.id,
            userToken: action.token,
            isLoading: false,
          };
        case 'LOG_IN':
          return {
            ...prevState,
            id: action.id,
            isLogout: false,
            userToken: action.token,
          };
        case 'LOG_OUT':
          return {
            ...prevState,
            id: null,
            isLogout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isLogout: false,
      userToken: null,
      id: null,
    },
  );

  // get auth
  React.useEffect(() => {
    // Fetch the token from storage
    const bootstrapAsync = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(credentials);
          dispatch({
            type: 'RESTORE_TOKEN',
            id: credentials.id,
            token: credentials.token,
          });
        } else {
          console.log('No credentials stored');
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      login: async data => {
        const {id, password} = data;
        await axios
          .post(
            Url + 'app/login',
            {id: id, password: password},
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(async response => {
            alert(response.data.message);
            response.data.status === 'success'
              ? (await Keychain.setGenericPassword(id, response.data.token),
                dispatch({type: 'LOG_IN', id: id, token: response.data.token}))
              : {};
          })
          .catch(error => {
            console.log(error);
          });
      },
      logout: async () => {
        //handle application side logout
        await Keychain.resetGenericPassword();
        dispatch({type: 'LOG_OUT'});
      },
      signup: async data => {
        const {id, password, confirmPassword, name} = data;
        await axios
          .post(
            Url + 'app/join',
            {
              id: id,
              password: password,
              password2: confirmPassword,
              name: name,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(response => {
            alert(response.data.message);
            if (response.data.status === 'success') {
              return true;
            } else if (response.data.status === 'fail') {
              return false;
            }
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
        return false;
      },
    }),
    [],
  );
  const context = {
    authContext,
    state,
  };

  return (
    // the Provider gives access to the context to its children
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export {AuthContext, AuthContextProvider};
