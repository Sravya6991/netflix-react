import React, { useState, useEffect } from 'react'
import axios from 'axios';

const murl = "http://localhost:3500/movies";

const Slider = () => {
    const [slide, setSlide] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(murl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': "application/json"
                    }
                });
                // console.log(response.data)
                const slides = response.data.slice(3,8);
                setSlide(slides);
                console.log(slide)
                
            } catch(err) {
                console.log(err);
            }
        }

        fetchData();
    },[])

  return (
    <div id="carouselExampleCaptions" className="carousel slide">
        <div className="carousel-inner">
            {slide && <div className="carousel-item active" key={slide[1]._id}>
                <img src={slide[1].imageurl} className="d-block w-100" alt={slide[1].title} width='100%' height='350px'/>
                <div className="carousel-caption d-none d-md-block">
                    <h5>{slide[1].title}</h5>
                </div>
            </div>
            }
            {slide && slide.map((item) => (
                <div className="carousel-item" key={item._id}>
                    <img src={item.imageurl} className="d-block w-100" alt={item.title} width='100%' height='350px'/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>{item.title}</h5>
                    </div>
                </div>
            ))}
            
            
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
    </div>
  )
}

export default Slider