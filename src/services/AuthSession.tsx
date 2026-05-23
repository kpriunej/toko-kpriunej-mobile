import useAuth from '../hooks/useAuth';
import { apiService } from './api.services';
import { apiUrl } from '../utils/helpers';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthSessionProps {
  children: React.ReactNode;
}

export default ({ children }: AuthSessionProps) => {
  const { setUser } = useAuth();

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    const response = await apiService('get', apiUrl('/api/auth/me'));
    if (response.status === 200) {
      setUser(response.data.data);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  
  return children;
}