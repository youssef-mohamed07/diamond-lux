import React from "react";
import pic1 from "../../assets/Homepic1.jpeg";
import pic3 from "../../assets/Homepic3.jpeg";
import pic4 from "../../assets/Homepic4.jpeg";
import pic5 from "../../assets/Homepic5.jpeg";
import pic6 from "../../assets/Homepic6.jpeg";



const PicSection = () => {
  return (
    <>
      <section
        className="flex justify-between items-center
        mx-auto w-[85%] h-[870px]"
        >
        <div className="flex flex-col justify-center content-between gap-10 w-[70%] h-fyll">
            <div
              className="p-[20px] w-[100%] h-[380px]
            bg-[rgb(31,31,31)] text-white  
            rounded-3xl border-none
            flex items-center justify-between gap-4 self-start
            ">
              <img src={pic1} alt="pic1" className="w-[50%] h-full rounded-3xl"></img>
              <p className="self-start mt-10">
                <h1 className="text-3xl font-bold text-white">
                  this is lorem ipsum
                </h1>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Repudiandae, est! Tenetur voluptatibus explicabo ipsa quibusdam,
                minima vero fuga praesentium deleniti? Officia excepturi veritatis
                molestias laboriosam quis consequuntur, dolores incidunt tempora?
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Repudiandae, est! Tenetur voluptatibus explicabo ipsa quibusdam,
                minima vero fuga praesentium deleniti?
              </p>
            </div>
            <div className="flex justify-between items-center gap-4 w-[100%] h-[450px] ">
                <div
                  className="bg-[rgb(31,31,31)] text-white  
                  rounded-3xl border-none
                  flex flex-col items-center gap-2 
                  p-[20px] w-[32%] h-full">
                  <img src={pic4} alt="pic4" className="w-[85%] h-1/2 mt-[5%] rounded-3xl"></img>
                  <p className="self-start mt-5 text-sm">
                    <h1 className="text-2xl font-bold text-white">this is lorem!</h1>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae, est! Tenetur voluptatibus explicabo ipsa quibusdam
                  </p>
                </div>
                <div
                  className="bg-[rgb(31,31,31)] text-white  
                rounded-3xl border-none
                flex flex-col items-center justify-center 
                p-[20px] w-[31%] h-full">
                  <img src={pic6} alt="pic6" className="w-[90%] h-[65%] rounded-3xl"></img>
                  <p className="self-start mt-3 text-sm">
                    <h1 className="text-2xl font-bold text-white">this is lorem!</h1>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae, est!
                  </p>
                </div>
                <div
                  className="bg-[rgb(31,31,31)] text-white  
                rounded-3xl border-none
                flex flex-col items-center gap-2 
                p-[20px] w-[31%] h-full">
                  <img src={pic5} alt="pic5" className="w-[85%] h-1/2 mt-[5%] rounded-3xl"></img>
                  <p className="self-start mt-5 text-sm">
                    <h1 className="text-2xl font-bold text-white">this is lorem!</h1>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae, est! Tenetur voluptatibus explicabo ipsa quibusdam
                  </p>
                </div>
            </div>
        </div>
        <div
          className="p-[20px] 
        bg-[rgb(31,31,31)] text-white  
          rounded-3xl border-none 
          flex flex-col items-center gap-2
          w-[28%] h-full">
          <img src={pic3} alt="pic3" className="w-full h-1/2 mt-[5%] rounded-3xl"></img>
          <p className="self-start mt-10">
            <h1 className="text-2xl font-bold text-white">this is lorem!</h1>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Repudiandae, est! Tenetur voluptatibus explicabo ipsa quibusdam,
            minima vero fuga praesentium deleniti? Officia excepturi veritatis
            molestias laboriosam quis consequuntur, dolores incidunt tempora?
            Lorem ipsum dolor sit
          </p>
        </div>
      </section>
    </>
  );
};
export default PicSection;
