import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('shopping.db');

export default function Shoppinglist({ onDelete }) {
  const [items, setItems] = useState([]);

  const updateList = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM shopping');
      setItems(result);
    } catch (error) {
      console.error('Could not get items', error);
    }
  };

  useEffect(() => {
    updateList();
  }, []);

  return (
    <FlatList
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemcontainer}>
          <Text>{item.product}</Text>
          <Text>{item.amount}</Text>
          <Text style={styles.deleteText} onPress={() => onDelete(item.id)}>Bought</Text>
        </View>
      )}
      data={items}
    />
  );
}

const styles = StyleSheet.create({
  itemcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  deleteText: {
    color: '#0000ff',
    fontWeight: 'bold',
  },
});
