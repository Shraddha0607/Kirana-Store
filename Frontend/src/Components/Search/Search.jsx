import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backendRoutesAPI from '../../BackendAPI/API'
import { debounce } from '../../HelperFiles/HelperFunction'
import "./Search.css"
import SuggestionList from './SuggestionList'


function Search() {
  const [inputValue, setinputValue] = useState('')
  const [searchedResult, setsearchedResult] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    const { value } = event.target
    setinputValue(value)
  }

  const fetchingData = async (value) => {
    setLoading(true)
    const response = await fetch(backendRoutesAPI.searchProductFromBackend.url + `?q=${value}`)
    const data = await response.json()
    console.log(data.data)
    if (data.success) {
      if (data.data.length > 0) {
        setsearchedResult(data.data)
        setLoading(false)
      }
      else if (data.data) {
        setsearchedResult([{ productName: 'No Result Found', _id: 0 }])
        setLoading(false)
      }
      else {
        setsearchedResult([])
      }
    }
    else {
      setError(data.message)
      setLoading(false)
    }
  }

  const debounceFetchData = useCallback(debounce((input) => {
    fetchingData(input);
  }, 300), []);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion['productName'] !== 'No Result Found') {
      setinputValue('');
      setsearchedResult([]);
      showProductPage(suggestion);
    }
    else{
      setinputValue('');
      setsearchedResult([]);
      setLoading(false)
    }
  }

  const showProductPage = (suggestion) => {
    navigate(`/productDetail/${suggestion._id}/view`)
  }

  useEffect(() => {
    if (inputValue.length > 1) {
      debounceFetchData(inputValue)
    }
    else if (inputValue.length === 0) {
      setsearchedResult([])
      setLoading(false)
    }
    else {
      setsearchedResult([])
      setLoading(false)
    }
  }, [inputValue])

  return (
    <>
      <form className={`relative search min-w-[200px] sm:col-span-8 col-span-6  my-auto`}
        style={{
          borderBottomLeftRadius: searchedResult.length > 0 ?'0px':'10px',
          borderBottomRightRadius: searchedResult.length > 0 ? '0px':'10px',
        }}
      >
        <div className='w-full flex align-middle items-center'>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type='search' value={inputValue.toUpperCase()} className="search-bar "
            placeholder='Search For Product,Brand and More....'
            onChange={handleInputChange} />
        </div>
        {
          ((searchedResult.length > 0 && inputValue.length > 1) || loading || error)
          &&
          <ul className={`suggestionlist h-[300px] w-full z-10 rounded-lg hidden-scrollbar text-left
                        overflow-y-scroll gap-2  py-2 top-[2.1rem] absolute bg-white 
                          ${searchedResult.length === 1 && 'h-fit'}`}>
            {loading && <div className='loading ml-9'>Loading.....</div>}
            {error && <div className='loading'>{error}</div>}
            <SuggestionList dataKey='productName' highlight={inputValue} suggestions={searchedResult}
              onSuggestionClick={handleSuggestionClick}
            />
          </ul>
        }
      </form>
    </>
  )
}

export default Search
