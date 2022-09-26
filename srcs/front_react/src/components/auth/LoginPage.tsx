import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ButtonLogin from "./ButtonLogin";
import TwoFactorCode from "./TwoFactorCode";
import './login.style.scss'


export default function LoginPage(props: any) {

  //<img src={LogoIcon}></img>
  return (
    <div className="login">
      <h1>transcendence</h1>
      <div className="loginBox">
        <h2>Account Sign in</h2>
        { !props.is2FA &&
          <ButtonLogin isLogin={props.isLogin} setIsLogin={props.setIsLogin} />
        }
        { props.is2FA &&
          <TwoFactorCode setIsLogin={props.setIsLogin}/>
        }
      </div>
    </div>

  );
}
