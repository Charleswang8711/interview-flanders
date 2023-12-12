import React, { ReactElement, useEffect } from 'react';
import styles from './styles.module.css';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Alert, Button, Link } from '@mui/material';
import { randomIntBetween } from '../../utils/math';
import { User } from './types';
import { InputText } from '../../components/InputText';

/**
 *  The login view.
 */
export default function Login(): ReactElement {

  const [user, setUser] = React.useState<User | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const timeoutId = React.useRef<number | null>(null)

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  const loginHandler = () => {

    if(timeoutId.current) clearTimeout(timeoutId.current)

    new Promise<string>((resolve, reject) => {

      timeoutId.current = window.setTimeout(() => {

        if(!user?.name || !user?.password) reject('name or password is empty')
        if (user?.name !== 'MAINT' || user.password !== 'safetyiskey') 
           reject('name or password is incorrect')

        resolve('a success token')
      }, randomIntBetween(100,600))
    }).then((token) => {
      setToken(token)
    }).catch((error) => {  
      setError(error)
    })
  }

  useEffect(() => {
    return () => {
      if(timeoutId.current) clearTimeout(timeoutId.current)
    }
  }, [])

  
  return (
    <>
    { 
      !!token ? 
      <div> 
        <h1> Welcome {user?.name} </h1> 
        <p> Your token is {token} </p>
      </div>
      : 
      <div className={styles.container}>
      <div className={styles.header}> Login</div>
      <div className={styles.name}>
        <InputText 
          id="name" 
          name='name'
          label = 'name' 
          onChange={onChangeHandler}/>
      </div>
      <div className={styles.password}>
        <InputText 
          id="password" 
          name='password' 
          label='password' 
          onChange={onChangeHandler}/>
      </div>
      
     <div className={styles.footer}>
      <FormControlLabel className={styles.rememberMe} control={<Checkbox className={styles.checkbox}  />} label="Remember Me" />
      <Link href='#' className={styles.forgotPW} underline='always' >Forgot Password</Link>
     </div>
  
     <Button 
      className={styles.LoginBtn} 
      onClick={loginHandler} 
      color='primary'
      size='large'
      variant="contained"> Login </Button>
    
     {!!error && <Alert severity="warning">{error}</Alert>}

     <div className={styles.NoAccount}>
       <p> Do not have an account</p> 
       <Link href='#' className={styles.RegHere} underline="always" >Register here</Link>
      </div>
    </div>
    }
    </>
 
    );
}