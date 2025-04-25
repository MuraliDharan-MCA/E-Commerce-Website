import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";



export const userProductStore = create((set)=>({
     products:[],
     loading:false,
     setProducts:(products) =>set({products}),

     createProducts:async(productData)=>{
          set({loading:true});

          try {
               const res = await axios.post('/products',productData);
               console.log(res);
               
               toast.success('Product Successfully Created! 🚀')
               set((prevState)=>({
                    products:[...prevState.products , res.data],
                    loading:false
               }))
          } catch (error) {
               toast.error(error.response.data.error);
               console.log(error);
               
               set({loading:false})
          }
     },
     fetchAllProducts:async()=>{
          set({loading:true});

          try {
               const responce = await axios.get('/products');
               set({products:responce.data.products,loading:false})
          } catch (error) {
               set({error:'Failed to fetch products',loading:false})
               toast.error(error.responce.data.error || 'Faild to fetch')
          }
     },
     clearProducts: () => set({ products: [] }),
     fetchProductsByCategory:async(category)=>{
          set({loading:true})

          try {
               const responce = await axios.get(`/products/category/${category}`) 
               // console.log(responce);
                  
               set({products:responce.data.products,loading:false}) 
          } catch (error) {
               set({error:'Failed to fetch Products',loading:false})
               // console.log(error)
               toast.error(error.responce.data.error || 'Failed to fetch Products')
          }
     },
     deleteProduct:async (productId) =>{
          set({loading:true})

          try {
               await axios.delete(`/products/${productId}`)
               set((prevProducts)=>({
                    products:prevProducts.products.filter((product)=>product._id !== productId),loading:false
               }))
          } catch (error) {
               set({loading:false})
               toast.error(error.responce.data?.error || 'Failed to delete product')
          }
     },
     toggleFeaturedProduct:async (productId) =>{
          set({loading:true})
          try {
               const responce = await axios.patch(`/products/${productId}`)
               console.log(responce)
               set((prevProducts)=>({
                    products:prevProducts.products.map((product)=> (product._id === productId ? {...product,isFeatured:responce.data.isFeatured}: product)),loading:false 
               }))
          } catch (error) {
               set({loading:false})
               toast.error(error.responce.data.error || 'Failed to Update product' )
          }
     },

     fetchFeaturedProducts:async()=>{
          set({loading:true})

          try {
               const response = await axios.get('/products/featured')
               // console.log(response.data)
               set({products:response.data,loading:false})
          } catch (error) {
               set({error:'failed to fetch products',loading:false})
               console.log('error fetching featured products',error)
          }
     }
}))