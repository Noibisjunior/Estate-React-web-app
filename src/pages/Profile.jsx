import { getAuth, updateProfile } from 'firebase/auth';
import {
  collection,
  getDocs,
  where,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { ImHome3 } from 'react-icons/Im';
import ListingItem from '../Components/ListingItem';

export default function Profile() {
  const auth = getAuth(); //initializing the auth from firebase
  const Navigate = useNavigate(); // initializing navigate hook
  const [changeDetail, setChangeDetail] = useState('false');
  const [listing, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  function onLogOut() {
    auth.signOut();
    Navigate('/');
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState, //keep the previous change
      [e.target.id]: e.target.value, // set the prev change to the current change
    }));
  }
  async function onSubmit() {
    //This function is returning a promise that is the reason why i use asyn-await
    try {
      if (auth.currentUser.displayName !== name) {
        //checks if the change happens
        //update displayName in firebase auth
        await updateProfile(auth.currentUser, {
          // we need to use await becausse it returns a promise
          displayName: name,
        });

        //update name in the firestore
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          //A Promise resolved once the data has been successfully written to the backend (note that it won't resolve while you're offline)
          name,
        });
      }
      toast.success('profile details updated');
    } catch (error) {
      toast.error('could not update the profile details');
    }
  }

  useEffect(() => {
    //using the useEffect hook to fetch the data from the database
    async function fetchUserListings() {
      const listingRef = collection(db, 'listings'); //address of the listing
      const q = query(
        listingRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      ); //query(listingRef,where("userRef
      const querySnap = await getDocs(q); //passing the query snapshot
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings); //showing the listings data to the user
      setLoading(false);
    }
    fetchUserListings(); //calling fetchUserListings
  }, [auth.currentUser.uid]);
  //the useeffect is triggered after the user listings have been fetched

  async function onDelete(listingID) {
    if (window.confirm('Are you sure you want to delete')) {
      await deleteDoc(doc(db, 'listings', listingID));
      const updatedListings = listing.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings)
      toast.success('successfully deleted the listing');
    }
  }

  function onEdit(listingID) {
    Navigate(`/edit-listing/${listingID}`);
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
      rounded transition ease-in-out ${
        changeDetail && 'bg-red-200 focus:bg-red-200'
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
                  onClick={() => {
                    changeDetail && onSubmit(); //once the form is updated,the form is submitted automatically to the database
                    setChangeDetail((prevState) => !prevState); //updating the changeDetail state
                  }}
                  className="text-red-600 hover:text-red-700 transition
                 ease-in-out duration-200 ml-2 cursor-pointer"
                >
                  {changeDetail ? 'Apply change' : 'Edit'}
                </span>
              </p>
              <p
                onClick={onLogOut}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            // onSubmit={onSubmit}
            className="w-full bg-blue-600
          text-white uppercase px-7 py-3 text-sm front-medium rounded 
          shadow-md hover:bg-blue-700 transition duration 150 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/CreateListing"
              className="flex
            justify-center items-center"
            >
              <ImHome3 className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or Rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listing.length > 0 && (
          <>
            <h2 className="text 2xl text-center mb-6 font-semibold">
              My Listing
            </h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listing.map((listings) => (
                <ListingItem
                  key={
                    //a new component
                    listing.id
                  }
                  id={listing.id}
                  listing={listings.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                /> //passing the props to the list item component
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
