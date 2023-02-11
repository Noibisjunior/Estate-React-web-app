import React,{useState} from 'react';
import { collection, getDoc, limit, orderBy, query } from 'firebase/firestore';
import { useEffect } from 'react';
import Spinner from '../Components/spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';
import { useNavigate } from 'react-router';

export default function Slider() {

  const [listing, setlisting] = useState(null);
  const [loading, setloading] = useState(true);

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  const Navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      const ListingRef = collection(db, 'listings');
      const q = query(ListingRef, orderBy('timestamp', 'desc'), limit(5));
      const docSnap = await getDoc(q);
      let listings = []
      docSnap.foreach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setlisting(listings); //updating the listing variable
      setloading(false);
    }
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listing.length === 0) {
    //returning empty listings
    return <></>;
  }

  return (
    listing && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: 'progressbar' }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listing.map((data, id) => {
            //destructuring data and id
            <SwiperSlide
              key={id}
              onClick={() => Navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center,no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="w-full h-[300px] overflow-hidden"
              >
                {' '}
                // adding a custom css to the imageSlider
                <p
                  className="text-[#f1fa] absolute left-1 top-3
              font-medium max-w-[90%] bg-[#457b9d] shadow-lg
              opacity-90 p-2 rounded-br-3xl"
                >
                  {data.name}
                </p>
                <p
                  className="text-[#f1fa] absolute left-1 
              font-semibold max-w-[90%] bg-[#eb3946] shadow-lg
              opacity-90 p-2 rounded-tr-3xl bottom-1"
                >
                  ${data.discountedPrice ?? data.regularPrice}
                  {data.type === "rent"  && "/month"}

                </p>
              </div>
            </SwiperSlide>;
          })}
        </Swiper>
      </>
    )
  );
}
