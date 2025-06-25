import { Navigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

const PrivateRoute = ({children}) => {
    
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/verify', {
                    withCredentials: true, 
                });
                
                if(response.data.success){
                    setAuth(true);
                }
            } catch (error) {
                console.error('Error verifying user:', error);
            } finally{
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    if(loading){
        return <div>Loading...</div>;
    }
    if(!auth){
        return <Navigate to="/" />
    }
    return children;
}

export default PrivateRoute;