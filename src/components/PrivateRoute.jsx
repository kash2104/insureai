import { Navigate } from "react-router";
import Cookies from "js-cookie";


const PrivateRoute = ({children}) => {
    const token = Cookies.get('token');


    if(!token){
        return <Navigate to="/" />
    }

    return children;
}

export default PrivateRoute;