import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CartPage from './cart/Page';
import HomePage from './home/Page';
import ProfilePage from './profile/Page';
import SearchPage from './search/Page';

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }: { route: { name: string } }) => ({
  headerShown: false,
  tabBarShowLabel: true,
  tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: 2,
  },
  tabBarStyle: {
    backgroundColor: '#ecfccb',
    borderTopWidth: 0,
    elevation: 4,
    // height: 60,
  },
  tabBarActiveTintColor: '#047857',
  tabBarInactiveTintColor: '#6b7280',
  tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    const iconName =
      route.name === 'Home'
        ? 'home'
        : route.name === 'Search'
        ? 'search'
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
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Cart" component={CartPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}
