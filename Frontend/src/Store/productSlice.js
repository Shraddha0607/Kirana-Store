import { createSlice } from '@reduxjs/toolkit'

const initialState = {
      product: null,
      isUpdating : null
}

export const productSlice = createSlice({
      name: 'product',
      initialState,
      reducers: {
            setProductDetail: (state, action) => {
                  state.product = action.payload;
            },
            setIsUpdating: (state, action) => {
                  state.isUpdating = action.payload;
            }
      },
})

// Action creators are generated for each case reducer function
export const { setProductDetail , setIsUpdating} = productSlice.actions

export default productSlice.reducer