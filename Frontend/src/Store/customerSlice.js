import { createSlice } from '@reduxjs/toolkit'

const initialState = {
      customer: null,
      currentStep:0
}

export const customerSlice = createSlice({
      name: 'customer',
      initialState,
      reducers: {
            setCustomerDetail: (state, action) => {
                  state.customer = action.payload;
            },
            setSteeperProgress : (state,action)=>{
                  state.currentStep = action.payload
            }
      },
})

// Action creators are generated for each case reducer function
export const { setCustomerDetail} = customerSlice.actions

export default customerSlice.reducer