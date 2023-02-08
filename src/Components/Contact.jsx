import { getDoc, limitToLast } from 'firebase/firestore';
import React, { useRef, useState } from 'react';

export default function Contact({ useRef, listing }) {
  //getting the props
  const [LandLord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getLandLord() {
      const docRef = doc(db, 'users', useRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandLord(docSnap.data());
      } else {
        toast.error('could not get landlord data');
      }
    }

    getLandLord();
  }, [useRef]);

  function onChange(e) {
    setMessage(e.target.value);
  }

  return (
    <>
      {' '}
      {LandLord !== null && (
        <div className="flex flex-col w-full">
          <p>
            Contact the {LandLord.name} for the
            {listing.name.toLowerCase()}
          </p>
          <div className="mt-3 mb-6">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-300 
              bg-white border-gray-300 border rounded transition 
              duration-150"
            ></textarea>
          </div>
          <a
            href={`mailto:${Landlord.email}?
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
