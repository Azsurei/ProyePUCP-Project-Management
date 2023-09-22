'use client'

import React from 'react';
import { useState } from 'react';
import Placeholder from '@/components/Placeholder';
import Button from '@/components/Button';
import styles from '@/styles/resetPassword.css';

function resetPassword() {
  const [password,setPassword] = useState("");
  const [passwordRepe,setpasswordRepe] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorRepe, setPasswordErrorRepe] = useState(false);
  const [tocoSegundoPassword,setTocoSegundoPassword] = useState(false);
  let passwordIguales=false;

  function handleChange(name,value){
    if(name==='contraseña'){
      setPassword(value)
      if(value.length<6){
        setPasswordError(true)
      }else{
        setPasswordError(false)
      }
    }else{
      setTocoSegundoPassword(true)
      setpasswordRepe(value)
      if(value.length<6){
        setPasswordErrorRepe(true)
        
      }else{
        setPasswordErrorRepe(false)
      }
    }
  }
  return (
    <div className="App">
      
      <div>
        <img src="/images/LogoPUCPwhite.png" className="logoPucp"></img>
        <img src="/images/LogoProyePUCPwhite.png" className="logoProyePucp"></img>
        
      </div>
      <div className="contenedor-principal">
        <div className='cabecera'>
          <div className='contenedor-nueva-contraseña'><span>Nueva</span>contraseña</div>
          <div className='contenedor-ingresar-contraseña'>Ingrese una contraseña, como mínimo con 6 caracteres</div>
        </div>
        <div className='cuerpo'>
          <div className='placeholders'>
            <Placeholder 
            attribute={{
              id: "contraseña",
              name: "contraseña",
              type: "password",
              placeholder: "Nueva contraseña"
              }}
              handleChange={handleChange}
              param={passwordError}
              />
            {passwordError && <label className='label-error'>
              Contraseña inválida o incompleta
            </label>}
            <Placeholder 
            attribute={{
              id: "contraseñaConfimar",
              name: "contraseñaConfimar",
              type: "password",
              placeholder: "Confirmar contraseña"
              }}
              handleChange={handleChange}
              param={passwordErrorRepe}
              />
              {passwordErrorRepe && <label className='label-error'>
              Contraseña inválida o incompleta
            </label>}
            {(password!==passwordRepe) && !passwordErrorRepe && tocoSegundoPassword && <label className='label-error'>
              Las contraseñas no son iguales
            </label>}
          </div>
          <div className='boton'>
            <Button text="Guardar" href={'#'}/>
          </div>
          <div className='otros-login'>
              <div className='roboto'>¿Tienes un cuenta?</div>
              <div><a href='#IniciarSesion' className='iniciar-sesion roboto'>Iniciar sesión</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default resetPassword;