import React from 'react'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

function PeopleAlsoBought() {
  const [recommendations,setRecommendations] = useState([])

  const [isLoding,setIsLoding] = useState(true)

  useEffect(()=>{
    const fetchRecommendations = async()=>{
     try {
      const res = await axios.get('/products/recommendations')
     setRecommendations(res.data)
     
     } catch (error) {
      toast.error(error.responce.data.message || 'An error occured While Fetching recommendations')
     }finally{
      setIsLoding(false)
     }
    }

    fetchRecommendations()
  },[])


  if(isLoding) return <LoadingSpinner />
  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>Pepole also bought</h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {
            recommendations.map((product)=>(
              <ProductCard key={product._id} product={product}/>
            ))
          }
      </div>
    </div>
  )
}

export default PeopleAlsoBought