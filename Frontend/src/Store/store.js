import { configureStore } from '@reduxjs/toolkit'
import  addToCartReducer  from './cartSlice.js'
import customerReducer from "./customerSlice.js"
import productReducer from "./productSlice.js"
import steeperStepReducer from './steeperStepSlice.js'
// State ko localStorage mein save karne ka function
const saveState = (state,name) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`${name}`, serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

// State ko localStorage se load karne ka function
const loadState = (name) => {
  try {
    const serializedState = localStorage.getItem(`${name}`);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};

// Initial state ko localStorage se load karna
const preloadedState = {
  addTocart: loadState('addTocart'),
  steeperStep : loadState('steeperStep')
  // other preloaded states if any
};

const store = configureStore({
  reducer: {
      customer : customerReducer,
      product : productReducer,
      addTocart : addToCartReducer,
      steeperStep : steeperStepReducer
  },
  preloadedState,
})
// Redux state change hone par local storage update karna
store.subscribe(() => {
  saveState(store.getState().addTocart,'addTocart');
  saveState(store.getState().steeperStep,'steeperStep');
});

export default store
