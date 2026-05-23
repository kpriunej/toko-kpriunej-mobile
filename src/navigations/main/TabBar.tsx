import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CartPage from '../../pages/keranjang/Page';
import HomePage from '../../pages/beranda/Page';
import ProfilePage from '../../pages/profil/Page';
import HistoryPage from '../../pages/pesanan/Page';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const screenOptions = () => ({
  headerShown: false,
  tabBarShowLabel: true,
  tabBarLabelStyle: {
    fontSize: 12,
  },
  tabBarStyle: {
    backgroundColor: '#ecfccb',
    borderTopWidth: 0,
    elevation: 3,
    height: 50,
  },
  tabBarActiveTintColor: '#047857',
  tabBarInactiveTintColor: '#6b7280',
});

const renderTabBar = (props: any) => <CustomTabBar {...props} />;
export default () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} tabBar={renderTabBar}>
      <Tab.Screen 
        name="Beranda" 
        component={HomePage} 
        options={{ tabBarIcon: 'home' } as any} 
      />
      <Tab.Screen 
        name="Keranjang" 
        component={CartPage} 
        options={{ tabBarIcon: 'shopping-cart' } as any} 
      />
      <Tab.Screen 
        name="Pesanan" 
        component={HistoryPage} 
        options={{ tabBarIcon: 'history' } as any} 
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfilePage} 
        options={{ tabBarIcon: 'user' } as any} 
      />
    </Tab.Navigator>
  );
};