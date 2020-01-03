import * as React from 'react';

export default React.createContext({
  login: (token: string, userId: string, tokenExpiration: string) => {},
  logout: () => {},
  token: null,
  userId: null,
})
