import { doc,getDoc } from 'firebase/firestore';
import  {  useState,useEffect } from 'react';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export default function Contact({ userRef, listing }) {
  //getting the props
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getLandLord() {
      const docRef = doc(db, 'users', userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error('could not get landlord data');
      }
    }

    getLandLord();
  }, [userRef]);

  function onChange(e) {
    setMessage(e.target.value);
  }

  return (
    <>
      
      {landLord !== null && (
        <div className="flex flex-col w-full">
          <p>
            Contact  {landLord.name} for 
           {""} {listing.name.toLowerCase()}
          </p>
          <div className="mt-3 mb-6">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-black-300 
              bg-white border-gray-300 border rounded transition 
              duration-150"
            ></textarea>
          </div>
          <a
            href={`mailto:${landLord.email}?
          subject=${listing.name}&body=${message}`}
          >
            <button
              type="button"
              className="px-7 py-3 bg-blue-600 text-white
            rounded text-sm uppercase shadow-md
            hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700
          focus:shadow-lg w-full text-center transition 
          duration-150 ease-out mb-6"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
