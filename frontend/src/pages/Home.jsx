import Hero from "../components/Hero";
import NewsletterBox from "../components/NewsletterBox";
import PopularProducts from "../components/PopularProducts";
import CategoryShapes from "../components/CategoryShapes";
import PicSection from "../components/Home/PicSection";
import HomeGallery from "../components/Home/HomeGallery"; 


const Home = () => {
  return (
    <div>
      <Hero />
      <CategoryShapes />
      {/* <PicSection /> */}
      <PopularProducts />
      <HomeGallery />
      {/* <NewsletterBox /> */}
    </div>
  );
};

export default Home;
