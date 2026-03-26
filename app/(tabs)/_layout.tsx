import React from 'react';
import { Tabs } from 'expo-router';
import { BrutalBottomTab } from '../../components/navigation/BrutalBottomTab';
import { BrutalHeader } from '../../components/navigation/BrutalHeader';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BrutalBottomTab {...props} />}
      screenOptions={{
        header: (props) => {
          const options = props.options as any;
          return (
            <BrutalHeader 
              title={options.headerTitle} 
              leftAction={options.headerLeft}
              rightAction={options.headerRight}
              showBackButton={options.headerBackVisible}
              hideBorder={options.headerHideBorder}
              backgroundColor={options.headerStyle?.backgroundColor}
            />
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          headerTitle: 'XIN CHÀO',
        }}
      />
      <Tabs.Screen
        name="pocket"
        options={{
          title: 'OFFLINE',
          headerTitle: 'SURVIVAL BAG',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          headerTitle: 'PROFILE',
        }}
      />
    </Tabs>
  );
}
