import React from 'react'
import {useParams} from 'react-router-dom'
const OneRestaurant = () => {
  const {param} = useParams()
  return (
    <div>{param}</div>
  )
}

export default OneRestaurant