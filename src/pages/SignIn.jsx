import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import OAuth from '../Components/OAuth';
import {  useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import {toast} from "react-toastify"

export default function SignIn() {
   const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData; //destructuring formData
  function onChange(e) {
    // console.log(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit(e){
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth,email,password)
      if(userCredential.user) {
        Navigate("/")
      }
    } catch (error) {
      toast.error("Bad user credentials")
    }
  }
  return (
    <>
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">Sign IN</h1>
        <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto ">
          <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
            <img
              src="https://plus.unsplash.com/premium_photo-1661423729611-2ad9b64b98f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
              alt="key"
              className="w-full rounded-2xl"
            />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onSubmit}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                placeholder="Email address"
                className="w-full px-4 py-2 text-xl text-gray-700 
              bg-white border-gray-300 rounded transition ease-in-out mb-6"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 text-xl text-gray-700 
              bg-white border-gray-300 rounded transition ease-in-out"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                <p className="mb-6 text-black-600">
                  Don't Have an Account,
                  <span
                    className=" text-black-600 cursor-pointer hover:text-red-700 transition duration-200 ease-in-out ml-1"
                    onClick={() => Navigate('/SignUp')}
                  >
                    Register
                  </span>
                </p>
                <p
                  className="mb-6 text-blue-600  cursor-pointer hover:text-blue-800 transition duration-200 ease-in-out ml-1"
                  onClick={() => Navigate('/ForgotPassword')}
                >
                  Forgot Password ?
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-7 py-3 
          text-sm font-medium uppercase rounded shadow-md
           hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg 
           active:bg-blue-800"
              >
                Sign In
              </button>
              <div
                className="my-4 items-center before:border-t flex 
           before:flex-1  
           before:border-gray-300 
           after:border-t  
           after:flex-1  
           after:border-gray-300"
              >
                <p className="text-center font-semibold mx-4">OR</p>
              </div>
              <OAuth />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

/* <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
         <form>
             <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
              className="w-full px-4 py-2 text-xl text-gray-700 
              bg-white border-gray-300 rounded transition ease-in-out mb-6"
            />
            <div className="relative mb-6">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 text-xl text-gray-700 
              bg-white border-gray-300 rounded transition ease-in-out"
              />
               {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div> 
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Don't have an account?
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-7 py-3 
          text-sm font-medium uppercase rounded shadow-md
           hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg 
           active:bg-blue-800"
            >
              Sign In
            </button>
            <div
              className="my-4 items-center before:border-t flex 
           before:flex-1  
           before:border-gray-300 
           after:border-t  
           after:flex-1  
           after:border-gray-300"
            >
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth/>
          </form>
        </div>
      </div>
    </section>*/
