import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebase';
import { FaShare } from 'recat-icons/fa';
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
            setShareLinkCopied(false)
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-400" />
      </div>
      {
        shareLinkCopied && <p className='fix top-[23%] right-[5%] font-semibold
        border-2 border-gray-300 rounded-md
        bg-white z-10 p-2'>Link Copied</p>
      }
    </main>
  );
}
