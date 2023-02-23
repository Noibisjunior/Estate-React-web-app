import { collection,  getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import {useEffect,useState} from 'react'
import {toast} from 'react-toastify'
import ListingItem from '../Components/ListingItem'
import {db} from '../firebase'
import Spinner from '../Components/spinner';

export default function Offers() {
const [listing,setListings] = useState(null)
const [loading,setLoading] = useState(true)
const [lastFetchListing,setLastFetchListing] = useState(null)

useEffect(() => {
  async function fetchListings(){
try {
  //get the reference to the database
  const listingRef = collection(db,"listings")
  //create the query
  const q = query(listingRef,where("offer","==",true),
  orderBy("timestamp","desc"),
  limit(8))
  //executing the query
  const querySnap = await getDocs(q)

  //create the lastvisible listing to show the loadmore button
const lastVisible = querySnap.docs[querySnap.docs.length - 1]
setLastFetchListing(lastVisible)

  //create the listings variable
  const Listing = []
  querySnap.forEach((doc) => {
    return Listing.push({
      id:doc.id,
      data:doc.data()
    })
  })
  setListings(Listing)
  setLoading(false)
} 
catch (error) {
  console.log(error);
  toast.error("could not fetch listings")
}
  }
fetchListings()
  }, [])

async function onFetchMoreListing(){
try {
  //get the reference to the database
  const listingRef = collection(db,"listings")
  //create the query
  const q = query(listingRef,where("offer","==",true),
  orderBy("timestamp","desc"),
  startAfter(lastFetchListing),
   //use this method to start after the last fetching
  limit(4))
  //executing the query
  const querySnap = await getDocs(q)

  //create the lastvisible listing to show the loadmore button
const lastVisible = querySnap.docs[querySnap.docs.length - 1]
setLastFetchListing(lastVisible)

  //create the listings variable
  const Listing = []
  querySnap.forEach((doc) => {
    return Listing.push({
      id:doc.id,
      data:doc.data()
    })
  })
  setListings((prevState)=>[
    ...prevState,...listing
  ])
  setLoading(false)
} 
catch (error) {
  console.log(error);
  toast.error("could not fetch listings")
}

};
  return (
    
    <div className='max-w-6xl mx-auto px-3'>
<h1 className='text-3xl text-center mt-6 font-bold mb-6'>Offers</h1>
{
  loading ? (
    <Spinner/>
  ) : listing && listing.length > 0 ? (
    <>
<main>
  <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3
  xl:grid-cols-4 2xl:grid-cols-5'>
    {listing.map((listing)=>{
<ListingItem key={listing.id}
id={listing.id}
listing={listing.data}   />
 })}
  </ul>
</main>
{lastFetchListing && (
  <div className='flex justify-center items-center'>
    <button onClick={onFetchMoreListing} className='bg-white px-3 py-1.5
    text-gray-700 border border-gray-300 mb-6 mt-6
    hover:border-slate-600 rounded transition duration-150
    ease-in-out'>Load More</button>
  </div>
)}

    </>
  ):(
    <p>There are no current offers</p>
  )
}
    </div>   
    
  )
}
