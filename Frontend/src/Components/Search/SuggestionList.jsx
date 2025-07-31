import React from 'react'
import { useNavigate } from 'react-router-dom'

const SuggestionList = ({
  suggestions = [],
  dataKey = 'productName',
  onSuggestionClick
}) => {
  return (
    <React.Fragment>
      {
          suggestions?.map((suggestion)=>{
            const currentSuggestion = suggestion[dataKey]
            return(
              <li className='w-full capitalize text-ellipsis line-clamp-1 
                              text-lg mt-0.5 mb-0.5 hover:rounded-md hover:bg-[#83C5BEaa] 
                              font-medium px-4 py-2 cursor-pointer' 
                  key={suggestion._id}
                  onClick={()=>{onSuggestionClick(suggestion)}}
              >
                    {currentSuggestion}
              </li>
            )
          })
      }
    </React.Fragment>
  )
}

export default SuggestionList
