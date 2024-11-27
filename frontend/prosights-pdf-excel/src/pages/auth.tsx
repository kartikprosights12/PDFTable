// src/pages/auth.tsx
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { urls } from "@/config/urls";
import { useDispatch } from 'react-redux';
import { setUserId } from '@/redux/UserSlice';

const AuthPage: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const dispatch = useDispatch(); // Redux dispatch

  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user) {
        try {
          // Retrieve the token
          const token = await getAccessTokenSilently();

          // Call the backend API to save user info
          const apiUrl = urls.apiBaseUrl + '/api/v1/users';
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
          });

          if (response.ok) {
            // Save user ID to Redux
            if (user.email) {
                localStorage.setItem('userEmail', user.email);
                dispatch(setUserId(user.email)); // 'sub' contains the user ID from Auth0
            } else {
                console.error('User ID is undefined');
            }
            // Redirect to the main platform
            router.push('/');
          } else {
            console.error('Failed to store user info');
          }
        } catch (error) {
          console.error('Error during token retrieval or API call:', error);
        }
      }
    };

    handleAuth();
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, router]);

  return <div>Loading...</div>; // Show a loader while handling authentication
};

export default AuthPage;
