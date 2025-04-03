import Hero from "../components/Hero";
import NewsletterBox from "../components/NewsletterBox";
import PopularProducts from "../components/PopularProducts";

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularProducts />
      <NewsletterBox />
    </div>
  );
};

export default Home;
