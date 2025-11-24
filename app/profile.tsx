import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>User Profile</Text>
      <Button title="Log Out" onPress={() => {}} />
    </View>
  );
}
