import React, { ReactElement } from 'react';
import styles from './styles.module.css';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Link } from '@mui/material';


export default function Login(): ReactElement {
  
  return (
  <div className={styles.container}>
    <div className={styles.header}> Login</div>
    <div className={styles.name}>
      <TextField id="name" name='name'label = 'name'/>
    </div>
    <div className={styles.password}>
      <TextField id="password" name='password' label='password' />
    </div>
    
   <div className={styles.footer}>
    <FormControlLabel control={<Checkbox  />} label="Remember Me" />
    <Link href='#' underline='hover' className={styles.forgotPW} >Forgot Password</Link>
   </div>

   <Button 
    className={styles.LoginBtn} 
    color='primary'
    size='large'
    variant="contained"> Login </Button>
  
   <div className={styles.NoAccount}>
     <p> Do not have an account</p> 
     <Link href='#' className={styles.RegHere} >Register here</Link>
    </div>
  </div>
    );
}