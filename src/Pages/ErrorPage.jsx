import errorPic from '../assets/228438-P28070-739.jpg';
import { useNavigate } from 'react-router';
import './page.css'


const ErrorPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className='relative'>
            
           <img className=' lg:w-[500px] bounce-twice mx-auto mt-10' src={errorPic} alt="" />
           <p className='text-2xl text-red-600 fade-in-up absolute lg:left-[650px] lg:top-[400px]'>Oops! Page not found</p>
          <button className='lg:ml-[700px] absolute lg:top-[450px]  text-white bg-black p-2 rounded-lg' onClick={()=>navigate('/')} >Back to home</button>
        </div>
    );
};

export default ErrorPage;