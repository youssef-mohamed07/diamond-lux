import Hero from "../components/Hero";
import NewsletterBox from "../components/NewsletterBox";
import PopularProducts from "../components/PopularProducts";
import HomeGallery from '../components/HomeGallery';

const Home = () => {
  return (
    <div>
      <Hero />
      <HomeGallery/>
      <PopularProducts />
      <NewsletterBox />
    </div>
  );
};

export default Home;
