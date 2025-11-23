import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';

interface Auth {
  login: boolean;
  setLogin: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<Auth>({
  login: false,
  setLogin: () => {}
});

const LoginContextProvider = ({ children }: { children: ReactNode }) => {
  const [login, setLogin] = useState<boolean>(!!localStorage.getItem('accessToken'));

  return (
    <AuthContext.Provider value={{ login, setLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default LoginContextProvider;
