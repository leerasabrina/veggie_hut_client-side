import Banner from "../Components/Banner";
import HighlightAdvertisement from "../Components/HighlightAdvertisement";
import Newsletter from "../Components/Newsletter";
import Product from "../Components/Product";
import WhyChooseUs from "../Components/WhyChooseUs";

const Home = () => {
    return (
        <div>
           <Banner></Banner>
           <Product></Product>
           <HighlightAdvertisement></HighlightAdvertisement>
           <WhyChooseUs></WhyChooseUs> 
           <Newsletter></Newsletter>
           
        </div>
    );
};

export default Home;