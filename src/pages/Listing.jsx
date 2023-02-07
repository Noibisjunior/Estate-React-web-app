import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebase';
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from 'recat-icons/fa';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../Components/spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';

import SwiperCore, {
  EffectFade,
  AutoPlay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  SwiperCore.use([AutoPlay, Navigation, Pagination, EffectFade]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, 'listing', params.listingId); //referencing the address in the firestore
      const docSnap = await getDoc(docRef); //getting the data
      if (docSnap.exists()) {
        //if the document exist in the database
        setListing(docSnap.data()); //then update the previous listing
        setLoading(false); //
      }
    }
    fetchListing();
    console.log(listing);
  }, [params.listingId]); //adding the dependency
  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerview={1}
        Navigation
        Pagination={{ type: 'progressbar' }}
        effect="fade"
        modules={[EffectFade]}
        autoPlay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white 
      cursor-pointer border-2 border-gray-400 rounded-full
      w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-400" />
      </div>
      {
        shareLinkCopied && (
          <p
            className="fix top-[23%] right-[5%] font-semibold
        border-2 border-gray-300 rounded-md
        bg-white z-10 p-2"
          >
            Link Copied
          </p>
        ) //if the shareLinkCopied is true then show the paragraph
      }

      <div
        className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg 
       shadow-lg bg-white lg:space-x-5"
      >
        <div className="w-full h-[200px] lg-[400px]">
          <p className="text-2xl font-bold mb-3 tetx-blue-900">
            {listing.name} - ${' '}
            {listing.offer ? listing.discountedPrice : listing.regularPrice}
            {listing.type === 'rent' ? '/ month' : ''} // using condition to
            display the rent/sale
          </p>{' '}
          // copy the reg expression for comma
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p
              className="bg-red-800 w-full max-w-[200px] rounded-md p-1
             text-white text-center font-semibold shadow-md"
            >
              {listing.type === 'rent' ? 'Rent' : 'sale'}
            </p>
            {Listing.offer && (
              <p
                className="w-full max-w-[200px] bg-green-500
               rounded-md p-1 text-white text-center 
               font-semibold shadow-md "
              >
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className="mt-3 mb-3">
            {' '}
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul
            className="flex items-center space-x-2 sm:space-x-10
          text-sm font-semibold"
          >
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
            </li>

            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
            </li>

            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {+listing.parking ? 'Parking spot' : 'No parking'}
            </li>

            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {+listing.furnished ? 'Furnished' : 'Not furnished'}
            </li>
          </ul>
        </div>
        <div className="bg-green-200 w-full h-[200px] lg-[400px] z-10 overflow-x-hidden"></div>
      </div>
    </main>
  );
}
