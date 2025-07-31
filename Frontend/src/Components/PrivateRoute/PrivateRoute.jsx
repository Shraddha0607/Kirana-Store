import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import backendRoutesAPI from '../../BackendAPI/API';
import AllPageLoading from '../LoadingComponentForAllPage/AllPageLoading';

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                  const backendAPIResponse = await fetch(backendRoutesAPI.current_user.url, {
                        method: backendRoutesAPI.current_user.method,
                        credentials: "include"
                      })
                      const finalResponse = await backendAPIResponse.json()
                if (finalResponse.success) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <AllPageLoading/>; // Optionally, you can show a loading spinner here
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
