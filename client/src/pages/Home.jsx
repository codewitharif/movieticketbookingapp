import React, { useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import MovieListing from "../components/MovieListing";
import WhyChooseUs from "../components/WhyChooseUs";
import FAQSection from "../components/FAQSection";
import { featuredMovies } from "../store/useMovieStore";

const Home = () => {

  return (
    <div>
      <HeroSlider featuredMovies={featuredMovies} />
      <MovieListing />
      <WhyChooseUs />
      <FAQSection />
    </div>
  );
};

export default Home;
