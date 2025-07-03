import React, { useContext } from 'react';
import { ValueContext } from '../Context/ValueContext';
import UseUserRole from '../Hooks/UseuserRole';
import { Navigate, useLocation } from 'react-router';

const RiderRoute = ({children}) => {
      
const {loading,currentuser}=useContext(ValueContext);
const {role , isloading}=UseUserRole();

let location = useLocation();
    if(loading|| isloading){
        return <span className="loading loading-spinner loading-xl"></span>
    }
  if (!currentuser || role!=='rider') {
     return <Navigate state={ location?.pathname }  to="/forbidden"/>;
  
  }
      return children;
};

export default RiderRoute;