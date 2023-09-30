import React, {useState, useEffect} from 'react'
import {useParams, useLocation} from "react-router-dom";
import axios from 'axios';
import "../../movies.css";

import HeaderUser from "../MoviesPage/HeaderUser";
import MovieInfo from './MovieInfo'
import FilterResults from '../MoviesPage/FilterResults';
import PopularMovies from '../MoviesPage/PopularMovies'

const murl = "http://localhost:3500/movies";
const surl = "http://localhost:3500/shows";
const durl = "http://localhost:3500/details/";
const url = "http://localhost:3500/userInfo";
const aurl = "http://localhost:3500/all";

const Details = () => {
  const [info, setInfo] = useState("");
  const [movies, setMovies] = useState("");
  const [shows, setShows] = useState("");
  const [all, setAll] = useState("");
  const [user, setUser] = useState("");
  const [filteredData, setFilteredData] = useState("");

  const movieName = useParams().name;
  const search = useLocation().search;
  const type = new URLSearchParams(search).get('type');

  useEffect(() => {
    const fetchData = async() => {
      
      try {
        const movieResult = await axios.get(`${durl}${movieName}?type=${type}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          }
        })
       
        const movies = await axios.get(murl, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          }
        });

        const shows = await axios.get(surl, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          }
        });

        const uresponse = await axios.get(`${url}`, {
          headers: {
            "x-access-token": sessionStorage.getItem("token")
          }
        });

        const aresponse = await axios.get(aurl, {
          method: 'GET',
          headers: {
            'Content-Type': "application/json"
          }
        });

        setInfo(movieResult.data)
        setMovies(movies.data)
        setShows(shows.data)
        setAll(aresponse.data);
        setUser(uresponse.data);

      } catch(err) {
        console.log(err)
      }
      
    }

    fetchData()

  },[movieName]);

  const filterItems = (items)=>{
    setFilteredData(items)
    console.log(filteredData)
  }

  return (
    <div>
      <HeaderUser username={user.userName} movies={all} filterData={filterItems}/>
      {(filteredData[0]) ? <FilterResults filterAPI={filteredData}/> : null}

      <MovieInfo movieInfo={info}/>
     
        {(info.type === 'movie') ? 
          (<div>
            <h6 className='container fs-5'>Similar movies</h6>
            <PopularMovies moviesList={movies}/> 
          </div>) :
          (<div>
            <h6 className='container fs-5'>Similar shows</h6>
            <PopularMovies moviesList={shows}/>
          </div>)
        }
      
    </div>
  )
}


export default Details;