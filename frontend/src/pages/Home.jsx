import Hero from "../components/Hero";
import NewsletterBox from "../components/NewsletterBox";
import PopularProducts from "../components/PopularProducts";
import CategoryShapes from "../components/CategoryShapes";

const Home = () => {
  return (
    <div>
      <Hero />
      <CategoryShapes />
      <PopularProducts />
      <NewsletterBox />
    </div>
  );
};

export default Home;
