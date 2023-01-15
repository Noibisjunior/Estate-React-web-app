import React, { useEffect, useState } from 'react';
import { useLocation , useNavigate} from 'react-router-dom';
import {getAuth, onAuthStateChanged} from "firebase/auth"

export default function Header() {
const [pageState,setPageState] = useState("Sign in")

  const location = useLocation();
  const Navigate = useNavigate()
const auth = getAuth()
useEffect(() =>{ // we want to check the changes of auth
onAuthStateChanged(auth,(user) => {
  if(user){
    setPageState('profile')
  }
  else{
    setPageState('sign in')
  }
})
},[auth])
//   console.log(location.pathname);
  
function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://revolutionplusproperty.com/img/logo-cropped.054b307a.png"
            alt="logo"
            className="h-15 w-15 cursor-pointer"
            onClick={() => Navigate('/')}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent ${
                   pathMatchRoute('/') && 'text-black border-b-red-500'
                 }`}
              onClick={() => Navigate('/')}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent ${
                   pathMatchRoute('/Offers') && 'text-black border-b-red-500'
                 }`}
              onClick={() => Navigate('/Offers')}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
                 text-gray-400 border-b-[3px] border-b-transparent ${
                   (pathMatchRoute('/SignIn') || pathMatchRoute('/Profile') )&& 'text-black border-b-red-500'
                 }`}
              onClick={() => Navigate('/Profile')}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
