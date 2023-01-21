import RestaurantDS from '../services/axios/restaurantDS.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Restaurants = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchZipcode, setSearchZipcode] = useState('');

  useEffect(() => {
    RestaurantDS.getAll().then((response) => {
      setRestaurants(response.data.restaurants);
    });
  }, []);

  const find = (query, by) => {
    RestaurantDS.find(query, by)
      .then((response) => {
        setRestaurants(response.data.restaurants);
      })
      .catch((e) => {});
  };
  return (
    <>
      <input
        type='text'
        value={searchZipcode}
        onChange={(e) => {
          setSearchZipcode(e.target.value);
        }}
      />
      <button
        type='button'
        onClick={(e) => {
          find(searchZipcode, 'zipcode');
        }}
      >
        Search
      </button>
      {restaurants.map((restaurant) => {
        const add = restaurant.address;
        const address = `${add.building} ${add.street} ${add.zipcode}`;
        return (
          <div>
            <h5>{restaurant.name}</h5>
            <p>
              <strong>Cuisine: </strong>
              {restaurant.cuisine}
              <br />
              <strong>Address: </strong>
              {address}
              <br />
            </p>
            <a
              target='_blank'
              rel='noreferrer'
              href={'https://www.google.com/maps/place/' + address}
            >
              View Map
            </a>
            <Link to={`/restaurants/${restaurant._id}`}>More Info</Link>
          </div>
        );
      })}
    </>
  );
};

export default Restaurants;
