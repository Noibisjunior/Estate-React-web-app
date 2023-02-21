import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../Components/spinner';
import { getAuth, } from 'firebase/auth';
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage'
import { addDoc, serverTimestamp,collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {v4 as uuidv4} from "uuid"


export default  function CreateListing() {
const auth = getAuth()
const Navigate = useNavigate()

  const [geoLocationEnabled,setGeoLocationEnabled] = useState(true)
  const [Loading,setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude:0,
    images:{}
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude ,
    longitude,
    images
  } = formData; //destructuring formData

  function onChange(e) {
    let boolean = null;
    if(e.target.value === "true"){
      boolean = true
    }
    if(e.target.value === "false"){
      boolean = false
    }
//files
    if(e.target.files){
      setFormData((prevState) =>({
        ...prevState,
        images:e.target.files,
      }))
    }
//Text/boolean/number
    if(!e.target.files){
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
  }

  //submitting the form to the database
async function onSubmit(e){
  e.preventDefault();
  setLoading(true); //changing the state of the form after submitting
  if (+discountedPrice >= +regularPrice) {
    setLoading(false);
    toast.error('Discounted price needs to be less than regular price');
    return;
  }
  if (Image.length > 6) {
    setLoading(false);
    toast.error('Maximum 6 images are allowed');
    return;
  }
  let geoLocation = {}
  geoLocation.lat = latitude;
  geoLocation.lng = longitude;

  //setting up the geoLocation
  // let geoLocation = {};
  // let location;
  // if (geoLocationEnabled) {
  //   const response = await fetch(
  //     `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
  //   );
  //   const data = await response.json();
  //   console.log(data);
  //   geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
  //   geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;

  //   location = data.status === 'ZERO_RESULTS' && undefined;

  //   if (location === undefined) {
  //     setLoading(false);
  //     toast.error('please provide a correct address');
  //     return;
  //   }
  // } else {
  // geoLocation.lat = latitude;
  // geoLocation.lng = longitude;

  //creating a functionality that will upload all images to the database
  // async function storeImage(image) {
  //   return new Promise((resolve, reject) => {
  //     const storage = getStorage();
  //     const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
  //     const storageRef = ref(storage, filename);
  //     const uploadTask = uploadBytesResumable(storageRef, image);
  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         // Observe state change events such as progress, pause, and resume
  //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log('Upload is ' + progress + '% done');
  //         switch (snapshot.state) {
  //           case 'paused':
  //             console.log('Upload is paused');
  //             break;
  //           case 'running':
  //             console.log('Upload is running');
  //             break;
  //         }
  //       },
  //       (error) => {
  //         // Handle unsuccessful uploads
  //         reject(error);
  //       },
  //       () => {
  //         // Handle successful uploads on complete
  //         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           resolve(downloadURL);
  //         });
  //       }
  //     );
  //   });
  // }
  async function storeImage(image) {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        }
      );

      uploadTask.then(
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        }
      );
    });
  }

  //generate url for the images
  const imgUrls = await Promise.all(
    [...images].map((image) => storeImage(image))
  ).catch((error) => {
    setLoading(false);
    toast.error('images not uploaded');
    return;
  });
  console.log(imgUrls);

  //create another instance of formData
  const formDataCopy = {
    ...formData, //instance of formdata state
    imgUrls,
    geoLocation,
    timestamp: serverTimestamp(),
    userRef: auth.currentUser.uid, //getting info of the user
  };
  delete formDataCopy.images;
  !formDataCopy.offer && delete formDataCopy.discountedPrice;
  delete formDataCopy.latitude;
  delete formDataCopy.longitude;

  const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
  setLoading(false);
  toast.success('listing created');
  Navigate(`/category/${formDataCopy.type}/${docRef.id}`);
}


   if (Loading) {
     return <Spinner />;
   }
  
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing </h1>

      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value="sell"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg  focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          type === 'rent' ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg  focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          type === 'sell' ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Property-Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700
      bg-white border border-gray-300 rounded transition duration-150
      ease-in-out  focus:text-gray-700
      focus:bg-white focus:border-slate-600 mb-6"
        />

        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              minLength="1"
              maxLength="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
          transition duration-150 ease-in-out
          focus:text-gray-700 focus:bg-white
          focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Bath</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              minLength="1"
              maxLength="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
          transition duration-150 ease-in-out
          focus:text-gray-700 focus:bg-white
          focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg  focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          !parking ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg  focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          parking ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={` px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg mr-3 focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          !furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg  focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          type === 'sale' ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Property-Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Property-address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700
      bg-white border border-gray-300 rounded transition duration-150
      ease-in-out  focus:text-gray-700
      focus:bg-white focus:border-slate-600 mb-6"
        />
        {!geoLocationEnabled && (
          <div className=" flex space-x-6 justify-start mb-6">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700
      bg-white border border-gray-300 rounded transition duration-150
      ease-in-out  focus:text-gray-700
      focus:bg-white focus:border-slate-600 mb-6 text-center"
              />
            </div>

            <div className="">
              <p className="text-lg font-semibold">longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700
      bg-white border border-gray-300 rounded transition duration-150
      ease-in-out  focus:text-gray-700
      focus:bg-white focus:border-slate-600 mb-6 text-center"
              />
            </div>
          </div>
        )}
        <p className="text-lg font-semibold">Property Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Property-description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700
      bg-white border border-gray-300 rounded transition duration-150
      ease-in-out  focus:text-gray-700
      focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg  font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg  focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          !offer ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
        hover:shadow-lg  focus:shadow-lg active:shadow-lg transition 
        duration-150 ease-in-out w-full ${
          offer ? 'bg-white text-black' : 'bg-slate-600 text-white'
        }`}
          >
            No
          </button>
        </div>
        <div className=" flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6 ">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="500000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border
                border-gray-300 rounded transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
              />
              {/* jsx syntax */}
              {type === 'rent' && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className=" flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full justify-center items-center space-x-6 ">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="500000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border
                border-gray-300 rounded transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
                />
                {/* jsx syntax */}
                {type === 'rent' && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="image"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300
  rounded focus:text-gray-700 focus:bg-white
                focus:border-slate-600"
           '
          />
          </div>
          <button onSubmit={onSubmit}
            type="submit"
            className="mb-6 w-full px-7 py-3 bg-blue-600 text-white
          font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg active:bg-red-800
          active:shadow-lg transition duration-150 ease-out mt-6"
          >
            Create Listing
          </button>
      </form>
    </main>
  );
}
