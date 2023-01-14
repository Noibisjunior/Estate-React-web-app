import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function Profile() {
  const auth = getAuth() //initializing the auth from firebase
  const Navigate = useNavigate() // initializing navigate hook
const [changeDetail,setChangeDetail] = useState("false")

  const [formData,setFormData] = useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email
  })
  const {name,email} = formData
  function onLogOut(){
    auth.signOut()
    Navigate("/")
  }

  function onChange(e){
setFormData((prevState) => ({
  ...prevState, //keep the previous change
  [e.target.id] : e.target.value // set the prev change to the current change
}))

 async function onSubmit(){ //This function is returning a promise that is the reason why i use asyn-await
try {
  if(auth.currentUser.displayName !== name){
    //update displayName in firebase auth
    await updateProfile(auth.currentUser,{ // we need to use await becausse it returns a promise
      displayName : name
    })

    //update name in the firestore
    const docRef = doc(db,"users",auth.currentUser.uid)
    await updateDoc(docRef, {
      //A Promise resolved once the data has been successfully written to the backend (note that it won't resolve while you're offline)
      name,
    });
  }
  toast.success("profile details updated")
} catch (error) {
toast.error("could not update the profile details")  
}
}
  }
  return (
    <>
      <section
        className="max-w-6xl mx-auto flex
    justify-center items-center flex-col"
      >
        <h1
          className="text-3xl text-center mt-6 
      font-bold"
        >
          MY profile
        </h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* Name input */}
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail} //if changeDetail is true,then the form is enabled
              onChange={onChange}
              className={` mb-6 w-full px-4 py-2 text-xl
      text-gray-700 bg-white border border-gray-300
      rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"
      }`}
            />

            {/* email input */}

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-xl
      text-gray-700 bg-white border border-gray-300
      rounded transition ease-in-out"
            />

            <div className="flex justify-between mb-6 whitespace-nowrap text-sm sm:text-lg">
              <p className="flex items-center mb-6">
                Do you want to change your name?
                {/* Adding the edit functionality using useState */}
                <span 
                onClick={() =>{
                  changeDetail && onSubmit() //once the form is updated,the form is submitted automatically to the database
                 setChangeDetail((prevState) => !prevState) //updating the changeDetail state
                }}
                className="text-red-600 hover:text-red-700 transition
                 ease-in-out duration-200 ml-2 cursor-pointer">{changeDetail ? "Apply change" : "Edit"}</span>
              </p>
              <p onClick={onLogOut} className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer">sign out</p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
