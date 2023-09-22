'use client'

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import Placeholder from '@/components/Placeholder';
import Button from '@/components/Button';
import '@/styles/login.css';

function Login() {
  const [password,setPassword] = useState("");
  const [usuario,setUsuario] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  function handleChange(name,value){
      if(name==='correo'){

          setUsuario(value)

      }else{
        if(value.length<6){
          setPasswordError(true)
          
        }else{
          setPasswordError(false)
          setpassword(value)
        }
      }
    }


  return (
    <>
    <div className="Fondo">
      
      <div>
        <img src="/images/LogoPUCPwhite.png" className="logoPucp"></img>
      </div>

      <div>
        <img src="/images/LogoProyePUCPwhite.png" className="logoProyePucp"></img>
      </div>


      <div className="CuadroLogin">
      

      <div>
        <p className="txtInicio"><span>Inicio de</span>sesión</p>

        <div className='placeholders'>
          <Placeholder 
          attribute={{
            id: "correo",
            name: "correo",
            type: "text",
            placeholder: "Correo electrónico"
            }}
            handleChange={handleChange}
            />
      
          <Placeholder 
          attribute={{
            id: "contrasena",
            name: "contrasena",
            type: "password",
            placeholder: "Contraseña"
            }}
            handleChange={handleChange}
            param={passwordError}
            />
            {passwordError && <label className='label-error'>
            Contraseña inválida o incompleta
          </label>}
        </div>



        <div className="divInicioSesion">
          <Link href='/login/resetPassword' className="txtOlvido">
            <span href='#IniciarSesion' className="txtOlvido" >¿Olvidó la contraseña?</span>
          </Link>
        </div>

        <div className='boton2'>
          <Button text="Iniciar Sesión" href={'#'}/>
        </div>   

        <div className="container">
            <div className="line"></div>
            <div className="greeting">O inicia sesión con</div>
            <div className="line"></div>
        </div>

        <div className='boton2'>
          <Button text="Google" href={'#'}/>
        </div>      
        

        <div className="contenedorPrincipal">
          <div className="sinCuenta">
            <p className="txtsinCuenta">¿No tienes Cuenta?</p>
          </div>
          <div className="divRegistrate">
            <Link href='/resetPassword' className="txtOlvido">
              <span className="txtRegistrate">Registrate</span>
            </Link> 
          </div>
        </div>


      </div>


      </div>


    </div>

  

    </>
  );
}

export default Login;