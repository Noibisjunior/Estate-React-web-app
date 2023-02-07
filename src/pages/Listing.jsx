import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebase';
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
    </main>
  );
}
