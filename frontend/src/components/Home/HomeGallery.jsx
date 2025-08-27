import React from 'react';
import { Link } from 'react-router-dom';
import G1 from "../../assets/gal1.jpeg";
import G2 from "../../assets/gal2.jpeg";
import G3 from "../../assets/gal3.jpeg";
import G4 from "../../assets/gal4.jpeg";

const HomeGallery = () => {
    return (
        <div className="w-[85%] xl:h-[870px] lg:h-[696px] md:h-[543px] sm:h-[435px] flex items-center justify-center my-20 mx-auto">
            <section className="w-[50%] h-full flex items-center justify-center">
                <div className="w-[80%] h-[55%] flex flex-col justify-center items-center">
                    <h1 className="text-3xl self-start mb-[8%] font-bold">Explore Our Collections</h1>
                    <p className="text-sm">Discover our exquisite range of luxury jewelry and certified diamonds. From timeless engagement rings to stunning necklaces, each piece is crafted with precision and elegance to celebrate life's most precious moments.</p>
                    <p className="mt-[3%] text-sm">Our diamond collection features ethically sourced, certified stones with exceptional clarity and brilliance. Whether you're looking for a classic solitaire or a custom design, we offer unparalleled quality and craftsmanship.</p>
                    <p className="mt-[3%] text-sm">Browse through our carefully curated gallery below to explore our signature collections. Each image represents a category of our finest pieces, designed to inspire and captivate.</p>
                </div>
            </section>
            <section className="w-[50%] h-full grid grid-cols-2 grid-rows-2 gap-4">
                <Link to="/products/jewellery/engagement-rings" className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer">
                        <img src={G1} alt='Engagement Rings Collection' className="w-full h-full object-cover duration-700" />
                    <div className="absolute inset-0 bg-[#D9D9D9] bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center origin-left scale-x-0 group-hover:scale-x-100">
                        <div className="text-black text-center transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700">
                            <h3 className="text-2xl font-bold mb-2">Engagement Rings</h3>
                            <p className="text-sm">Explore Collection</p>
                        </div>
                    </div>
                </Link>
                <Link to="/products/diamond" className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer">
                        <img src={G2} alt='Diamond Collection' className="w-full h-full object-cover duration-700" />
                    <div className="absolute inset-0 bg-[#D9D9D9] bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center origin-left scale-x-0 group-hover:scale-x-100">
                        <div className="text-black text-center transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700">
                            <h3 className="text-2xl font-bold mb-2">Premium Diamonds</h3>
                            <p className="text-sm">View Diamonds</p>
                        </div>
                    </div>
                </Link>
                <Link to="/products/jewellery/necklaces" className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer">
                        <img src={G3} alt='Necklaces Collection' className="w-full h-full object-cover duration-700" />
                    <div className="absolute inset-0 bg-[#D9D9D9] bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center origin-left scale-x-0 group-hover:scale-x-100">
                        <div className="text-black text-center transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700">
                            <h3 className="text-2xl font-bold mb-2">Luxury Necklaces</h3>
                            <p className="text-sm">Shop Necklaces</p>
                        </div>
                    </div>
                </Link>
                <Link to="/products/jewellery/bracelets" className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer">
                        <img src={G4} alt='Bracelets Collection' className="w-full h-full object-cover duration-700" />
                    <div className="absolute inset-0 bg-[#D9D9D9] bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center origin-left scale-x-0 group-hover:scale-x-100">
                        <div className="text-black text-center transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700">
                            <h3 className="text-2xl font-bold mb-2">Elegant Bracelets</h3>
                            <p className="text-sm">Shop Bracelets</p>
                        </div>
                    </div>
                </Link>
            </section>
        </div>
    )
}

export default HomeGallery