import React, { Fragment } from 'react'
import Banner from '../Components/HomePageComponents/Banner'
import CategoryList from '../Components/HomePageComponents/CategoryList'
import HorizontalDisplayStream from '../Components/HomePageComponents/HorizontalDisplayStream'

function Home() {
  return (
    <>
    <CategoryList/>
    <Banner/>
    {/* Products Display */}
    <HorizontalDisplayStream subcategory={"Smartphones"} heading={"Top Deal On Latest SmartPhone's"} />
    <HorizontalDisplayStream subcategory={"Dishwashers"} heading={"Top Deal On Latest Dishwashers"} />
    <HorizontalDisplayStream subcategory={"Airpods"} heading={"Top Deal On Latest Airpods"} />
    </>
    
  ) 
}

export default Home
