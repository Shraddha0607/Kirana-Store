import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import backendRoutesAPI from '../BackendAPI/API'
//Action for Storing
export const saveCartItems = createAsyncThunk('saveCartItems', async (item) => {
      const itemId = item._id
      const backendAPIResponse = await fetch(backendRoutesAPI.loggedInCustomerCartDetail.url, {
            method: backendRoutesAPI.loggedInCustomerCartDetail.method,
            credentials: 'include',
            headers: {
                  'content-type': 'application/json'
            },
            body: JSON.stringify({ _id: itemId })
      })
      const finalRes = await backendAPIResponse.json()
      if (finalRes.success) {
            return finalRes.message
      }
      else {
            toast.error(finalRes.message)
      }
})
export const getCurrentUserCartDetail = createAsyncThunk('getCurrentUserCartDetail', async () => {
      const backendApiResponse = await fetch(backendRoutesAPI.getCustomerCartDetail.url, {
            method: backendRoutesAPI.getCustomerCartDetail.method,
            credentials: "include"
      })
      const finalResponse = await backendApiResponse.json()
      if (finalResponse.success) {
            return finalResponse.data
      }
      else {
            return finalResponse.data
      }
})
export const removeItemFromCart = createAsyncThunk('removeItemFromCart', async (itemId) => {
      const backendAPIResponse = await fetch(backendRoutesAPI.deleteItemFromCart.url, {
            method: backendRoutesAPI.deleteItemFromCart.method,
            credentials: 'include',
            headers: {
                  'content-type': 'application/json'
            },
            body: JSON.stringify({ _id: itemId })
      })
      const finalResponse = await backendAPIResponse.json()
      if (finalResponse.success) {
            return finalResponse
      } else {
            return finalResponse
      }
})
const initialState = {
      totalNumberOfProduct: 0,
      items: [],
      totalCartPrice: 0,
}

export const addToCartSlice = createSlice({
      name: 'addToCart',
      initialState,
      reducers: {
            // This is used to for the Guest User
            setProductDetail: (state, action) => {
                  state.items.push({ product: action.payload, quantity: 1 })
                  state.totalNumberOfProduct = state.items.length
            },
            resetProductDetail: (state) => {
                  state.totalNumberOfProduct = 0
                  state.items = []
                  state.totalCartPrice = 0
            },
            //This function is used to set the data of the Customer when it login again
            setCurrentCustomerCartDetail: (state, action) => {
                  action.payload.items.map((item) => {
                        const haveItem = state.items.some((haveItem) => haveItem.product._id === item.productId._id)
                        if (!haveItem) {
                              state.items.push({ product: item.productId, quantity: item.quantity })
                        }
                  })
                  state.totalNumberOfProduct = state.items.length
            },
            incProductCount: (state, action) => {
                  const existingItemIndex = state.items.findIndex((item) => item.product._id === action.payload.productId)
                  if (existingItemIndex >= 0) {
                        state.items[existingItemIndex].quantity = state.items[existingItemIndex].quantity + 1
                  }
            },
            decProductCount: (state, action) => {
                  const existingItemIndex = state.items.findIndex((item) => item.product._id === action.payload.productId)
                  if (existingItemIndex >= 0) {
                        if (state.items[existingItemIndex].quantity > 1) {
                              state.items[existingItemIndex].quantity = state.items[existingItemIndex].quantity - 1
                        }
                  }
            }
      },
      extraReducers: (builder) => {
            builder
                  //getCurrentUserCartDetail
                  .addCase(getCurrentUserCartDetail.pending, (state, action) => {
                        state.status = 'Pending'
                  })
                  .addCase(getCurrentUserCartDetail.fulfilled, (state, action) => {
                        state.status = 'Fullfilled'
                        
                        if (action.payload?.items.length > 0) {
                              state.items = [];
                              action.payload.items.map((item) => {
                                    // const haveItem = state.items.some((haveItem) => haveItem.product._id === item.productId._id)
                                    // if (!haveItem) {
                                    //       state.items.push({ product: item.productId, quantity: item.quantity })
                                    // }
                                    state.items.push({ product: item.productId, quantity: item.quantity })
                              })
                              state.totalNumberOfProduct = state.items.length
                        }
                  })
                  .addCase(getCurrentUserCartDetail.rejected, (state, action) => {
                        toast.error(action.payload?.message)
                  })

                  //saveCartItems
                  .addCase(saveCartItems.pending, (state, action) => {
                        state.addProductStatus = 'Pending'
                  })
                  .addCase(saveCartItems.fulfilled, (state, action) => {
                        toast.success(action.payload)
                        state.addProductStatus = 'fullfilled'
                  })
                  .addCase(saveCartItems.rejected, (state, action) => {
                        toast.error(action.payload.message)
                  })

                  //removeItemFromCart
                  .addCase(removeItemFromCart.pending, (state, action) => {
                        state.addProductStatus = 'Pending'
                  })
                  .addCase(removeItemFromCart.fulfilled, (state, action) => {
                        const data = action.payload.data
                        state.items = []
                        if (data.items.length > 0) {
                              data.items.map((item) => {
                                    state.items.push({ product: item.productId, quantity: item.quantity })
                              })
                        }
                        state.totalNumberOfProduct = state.items.length
                        toast.success(action.payload.message)

                  })
                  .addCase(removeItemFromCart.rejected, (state, action) => {
                        toast.error(action.payload.message)
                  })
      }
})

// Action creators are generated for each case reducer function
export const { setProductDetail, resetProductDetail, setCurrentCustomerCartDetail, incProductCount, decProductCount } = addToCartSlice.actions

export default addToCartSlice.reducer


