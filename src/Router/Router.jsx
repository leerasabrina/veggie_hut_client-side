import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Dashboard from "../Pages/DashBoard/Dashboard";
import Overview from "../Pages/DashBoard/Overview";
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import DashboardSeller from "../Pages/DashBoard/DashboardSeller";
import ErrorSeller from "../Pages/Error/ErrorSeller";
import AddItem from "../Pages/DashBoard/AddItem";
import AddAdvertisement from "../Pages/DashBoard/AddAdvertisement";
import MyItems from "../Pages/DashBoard/MyItems";
import UpdateItem from "../Pages/DashBoard/UpdateItem";
import MyAdvertisement from "../Pages/DashBoard/MyAdvertisement";
import DashboardAdmin from "../Pages/DashBoard/DashboardAdmin";
import AllUser from "../Pages/DashBoard/AllUser";
import AllProducts from "../Pages/DashBoard/AllProducts";
import AllAdvertisement from "../Pages/DashBoard/AllAdvertisement";
import DetailProduct from "../Pages/DetailProduct";
import All from "../Pages/All";
import OrderList from "../Pages/DashBoard/UserDashboardPages/OrderList";
import Manage from "../Pages/DashBoard/UserDashboardPages/Manage";
import View from "../Pages/DashBoard/UserDashboardPages/View";
import CheckOrder from "../Pages/DashBoard/CheckOrder";
import PrivateUser from "../Private/PrivateUser";
import PrivateSeller from "../Private/PrivateSeller";
import ErrorAdmin from "../Pages/Error/ErrorAdmin";
import ErrorUser from "../Pages/Error/ErrorUser";



export const router = createBrowserRouter([
    {
      path: "/",
      errorElement:<ErrorPage></ErrorPage>,
      element:<Root></Root>,
      children:[
        {index:true,element:<Home></Home>},
        {path:'market/:id',element:<PrivateUser><DetailProduct></DetailProduct></PrivateUser>},
        {path:'all',element:<All></All>},
        {path:'signin',element:<SignIn></SignIn>},
        {path:'signup',element:<SignUp></SignUp>},
       
      ]
    },
    {
        path:'/dashboard',
        element:<PrivateUser><Dashboard></Dashboard></PrivateUser>,
        errorElement: <ErrorUser></ErrorUser>,
        children:[
            {index:true,element:<Overview></Overview>},
            {path:'*',element:<ErrorUser></ErrorUser>},
            {path:'view',element:<View></View>},
            {path:'manage',element:<Manage></Manage>},
            {path:'order-list',element:<OrderList></OrderList>}
        ]
    },
    {
        path:'/dashboard-seller',
        element:<PrivateSeller><DashboardSeller></DashboardSeller></PrivateSeller>,
        errorElement: <ErrorSeller />,
        children:[
            {index:true,element:<Overview></Overview>},
            {path:'*',element:<ErrorSeller></ErrorSeller>},
            {path:'add-item',element:<AddItem></AddItem>},
            {path:'add-adv',element:<AddAdvertisement></AddAdvertisement>},
            {path:'my-advs',element:<MyAdvertisement></MyAdvertisement>},
            {path:'my-items',element:<MyItems></MyItems>},
            {path:'update-product/:id',element:<UpdateItem></UpdateItem>},
            
           
    
        ]
    },
    {
        path:'/dashboard-admin',
        element:<DashboardAdmin></DashboardAdmin>,
        errorElement: <ErrorAdmin></ErrorAdmin>,
        children:[
            {index:true,element:<Overview></Overview>},
            {path:'*',element:<ErrorAdmin></ErrorAdmin>},
            {path:'all-product',element:<AllProducts></AllProducts>},
            {path:'all-user',element:<AllUser></AllUser>},
            {path:'all-order',element:<CheckOrder></CheckOrder>},
            {path:'all-adv',element:<AllAdvertisement></AllAdvertisement>},
            {path:'update-product/:id',element:<UpdateItem></UpdateItem>},
            
           
    
        ]
    },
  ]);