import { createSlice } from '@reduxjs/toolkit'

const initialState = {
      currentStep:0
}

export const steeperSlice = createSlice({
      name: 'steeperStep',
      initialState,
      reducers: {
            setSteeperProgress : (state,action)=>{
                  state.currentStep = action.payload
            }
      },
})

// Action creators are generated for each case reducer function
export const {setSteeperProgress } = steeperSlice.actions

export default steeperSlice.reducer