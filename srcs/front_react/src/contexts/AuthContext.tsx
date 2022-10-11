import React, { useState } from "react";
import ErrorSnackbar from "../components/snackbar/ErrorSnackbar";
import SuccessSnackbar from "../components/snackbar/SuccessSnackbar";

export type User = {
  id: number;
  username: string;
  email: string;
  enabled2FA: boolean;
}

export type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  openError: boolean;
  setOpenError: (openError: boolean) => void;
  openSuccess: boolean;
  setOpenSuccess: (openSuccess: boolean) => void;
  reason: string;
  setReason: (reason: string) => void;

  //monitoringSocket: WebSocket | null;
}

export const AuthContext = React.createContext<Partial<AuthContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: IProps) => {

  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [reason, setReason] = useState("");

  const login = (user: User) => {
    setIsLogin(true);
    setUser(user);
  }

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  }


  return (

    <AuthContext.Provider value={{ isLogin, user, login, logout, setOpenError, setOpenSuccess, setReason }}>
      {children}
      <SuccessSnackbar/>
      <ErrorSnackbar
        openError={openError}
        setOpenError={setOpenError}
        reason={reason}
      />
    </AuthContext.Provider>
  );

}
