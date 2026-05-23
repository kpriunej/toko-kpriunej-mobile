import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { bootstrapCartCount, getTotalItems, subscribeToCartChanges } from '../../services/cartService';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const scales = useRef(state.routes.map(() => new Animated.Value(1))).current;
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      await bootstrapCartCount();
      const cart = await getTotalItems();
      setCartCount(cart);
    };

    loadCount();

    const unsubscribe = subscribeToCartChanges(async () => {
      const cart = await getTotalItems();
      setCartCount(cart);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    scales.forEach((val, i) => {
      Animated.spring(val, {
        toValue: i === state.index ? 1.08 : 1,
        useNativeDriver: true,
        stiffness: 200,
        damping: 12,
      } as any).start();
    });
  }, [state.index, scales]);

  return (
    <SafeAreaView edges={['bottom']}>
      <View className="bg-sky-100">
        <View className="flex-row justify-around items-center h-16 pt-1 bg-sky-100 shadow-sm shadow-slate-200">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const focused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name as never);
              }
            };

            // AMBIL DARI options.tabBarIcon, BUKAN route.icon
            const customIconName = options.tabBarIcon as any;
            const iconName = customIconName ?? 'circle';

            return (
              <TouchableOpacity
                key={route.key}
                // ... (properti aksesibilitas & style tetap sama)
                onPress={onPress}
                className="flex-1 items-center"
                activeOpacity={0.8}
              >
                <View className="relative">
                  <Animated.View style={{ transform: [{ scale: scales[index] }] }}>
                    <FontAwesome5 name={iconName} size={20} color={focused ? '#3b82f6' : '#6b7280'} solid={focused} />
                  </Animated.View>
                  
                  {/* UBAH 'Cart' MENJADI 'Keranjang' SESUAI DENGAN route.name */}
                  {route.name === 'Keranjang' && cartCount > 0 && (
                    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 justify-center items-center border-2 border-lime-100 px-1">
                      <Text className="text-[10px] font-bold text-white">{cartCount > 99 ? '99+' : cartCount}</Text>
                    </View>
                  )}
                </View>
                <Text className={`mt-1 text-[12px] ${focused ? 'text-sky-700' : 'text-slate-500'}`}>
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomTabBar;
