import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CartPage from '../../pages/home/cart/Page';
import HomePage from '../../pages/home/Page';
import ProfilePage from '../../pages/home/profile/Page';
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
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Cart" component={CartPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
};