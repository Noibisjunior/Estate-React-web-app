import { db } from '../firebase';
import {
  collection,
  getDocs,
  getDoc,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Slider from '../Components/Slider';
import { Link } from 'react-router-dom';
import ListingItem from '../Components/ListingItem';

export default function Home() {
  // for offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //get reference
        const ListingRef = collection(db, 'listings');
        //create the query
        const q = query(
          ListingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        //execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // places for Rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //get reference
        const ListingRef = collection(db, 'listings');
        //create the query
        const q = query(
          ListingRef,
          where('type', '==', 'rent'),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        //execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings); //create the index
      
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // places for Sale
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //get reference
        const ListingRef = collection(db, 'listings');
        //create the query
        const q = query(
          ListingRef,
          where('type', '==', 'sale'),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        //execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings); //create the index
    
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 spa-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p
                className="px-3 text-sm text-blue-600
              hover:text-blue-800 transition duration-150 ease-out"
              >
                Show more Offers
              </p>
            </Link>
            <ul
              className="sm:grid sm:grid-cols-2
             lg:grid-cols-3 xl:grid-cols-4"
            >
              {offerListings.map((listing) => {
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />;
              })}
            </ul>
          </div>
        )}
        {/* //rent */}
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              places For Rent
            </h2>
            <Link to="/category/rent">
              <p
                className="px-3 text-sm text-blue-600
              hover:text-blue-800 transition duration-150 ease-out"
              >
                Show more places For Rent
              </p>
            </Link>
            <ul
              className="sm:grid sm:grid-cols-2
             lg:grid-cols-3 xl:grid-cols-4"
            >
              {rentListings.map((listing) => {
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />;
              })}
            </ul>
          </div>
        )}
        {/* //sale */}
        {saleListings && saleListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
              places For Sale
            </h2>
            <Link to="/category/sale">
              <p
                className="px-3 text-sm text-blue-600
              hover:text-blue-800 transition duration-150 ease-out"
              >
                Show more places For Sale
              </p>
            </Link>
            <ul
              className="sm:grid sm:grid-cols-2
             lg:grid-cols-3 xl:grid-cols-4"
            >
              {saleListings.map((listing) => {
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
