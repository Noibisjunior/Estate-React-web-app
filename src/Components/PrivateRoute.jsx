import { Outlet,Navigate } from 'react-router-dom';
import {useAuthStatus} from '../hooks/useAuthStatus';
import Spinner from './spinner';

export default function PrivateRoute() {
    const {loggedIn,checkingStatus} = useAuthStatus() //initializing the custom hook
    if(checkingStatus){
        return <Spinner/>
    }
  return loggedIn ? <Outlet/> :
   <Navigate to="/SignIn"/>
}
