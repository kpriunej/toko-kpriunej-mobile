import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CartPage from './cart/Page';
import HomePage from './home/Page';
import ProfilePage from './profile/Page';
import SearchPage from './search/Page';

type TabKey = 'home' | 'search' | 'cart' | 'profile';

const tabItems: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'search', label: 'Search', icon: 'search' },
  { key: 'cart', label: 'Cart', icon: 'shopping-cart' },
  { key: 'profile', label: 'Profile', icon: 'user' },
];

export default () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>('home');

  const content = useMemo(() => {
    switch (selectedTab) {
      case 'search':
        return <SearchPage />;
      case 'cart':
        return <CartPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  }, [selectedTab]);

  return (
    <View className="flex-1 bg-lime-50">
      {content}
      <View className="absolute bottom-0 left-0 right-0 py-2 shadow-inner">
        <View className="mx-4 flex-row items-center justify-around rounded-full bg-emerald-50 px-3 py-2">
          {tabItems.map(tab => {
            const isActive = tab.key === selectedTab;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setSelectedTab(tab.key)}
                className={`items-center px-2 py-1 rounded-lg ${
                  isActive ? 'bg-emerald-100' : ''
                }`}
              >
                <FontAwesome5
                  name={tab.icon}
                  size={18}
                  color={isActive ? '#047857' : '#6b7280'}
                  solid={isActive}
                />
                <Text
                  className={`text-xs ${
                    isActive ? 'text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};
