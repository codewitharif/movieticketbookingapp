import React from "react";
import HeroSlider from "../components/HeroSlider";
import MovieListing from "../components/MovieListing";
import WhyChooseUs from "../components/WhyChooseUs";
import { featuredMovies, movies } from "../store/useMovieStore";

const Home = () => {
  return (
    <div>
      <HeroSlider featuredMovies={featuredMovies} />
      <MovieListing   movies={movies} />
      <WhyChooseUs />
    </div>
  );
};

export default Home;
