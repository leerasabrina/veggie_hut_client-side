import errorPics from '../../assets/2480259.jpg'
import { useNavigate } from 'react-router';
import '../page.css';



const ErrorUser= () => {
    const navigate = useNavigate();
    
    return (
        <div className='relative'>
            
           <img className=' lg:w-[500px] bounce-twice mx-auto mt-10' src={errorPics} alt='error' />
           <p className='text-2xl text-red-600 fade-in-up absolute lg:left-[550px] lg:top-[300px]'>Oops! Page not found</p>
          <button className='lg:ml-[600px] absolute lg:top-[350px] p-2 bg-green-700 rounded-lg text-white' onClick={()=>navigate('/dashboard')} >Back to Dashboard</button>
        </div>
    );
};

export default ErrorUser;