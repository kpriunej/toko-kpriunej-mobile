import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CartPage from './cart/Page';
import HomePage from './home/Page';
import ProfilePage from './profile/Page';

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }: { route: { name: string } }) => ({
  headerShown: false,
  tabBarShowLabel: true,
  tabBarLabelStyle: {
    fontSize: 12,
  },
  tabBarStyle: {
    backgroundColor: '#ecfccb',
    borderTopWidth: 0,
    elevation: 4,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarActiveTintColor: '#047857',
  tabBarInactiveTintColor: '#6b7280',
  tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    const iconName =
      route.name === 'Home'
        ? 'home'
        : route.name === 'Cart'
        ? 'shopping-cart'
        : 'user';

    return <FontAwesome5 name={iconName} size={size} color={color} solid={focused} />;
  },
});

export default function Main() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Cart" component={CartPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
