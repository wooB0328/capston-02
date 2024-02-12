import React, { useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [selectedItem, setSelectedItem] = useState('');

  const renderPickerItems = () => {
    const items = [];
    for (let i = 0; i <= 2024; i++) {
      items.push(<Picker.Item label={String(i+"년")} value={String(i)} key={String(i)} />);
    }
    return items;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Picker
        selectedValue={selectedItem}
        style={{ height: 20, width: 140 }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
      >
        {renderPickerItems()}
      </Picker>
    </View>
  );
}
