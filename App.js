import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  const db = SQLite.openDatabaseSync('shopping.db');

  const initialize = async () => {
    try {
      await db.execAsync(`CREATE TABLE IF NOT EXISTS shopping (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT, amount TEXT);`);
    } catch (error) {
      console.error('Could not open database', error);
    }
  };

  const saveItem = async () => {
    try {
      await db.runAsync('INSERT INTO shopping (product, amount) VALUES (?, ?)', [product, amount]);
      await updateList();
    } catch (error) {
      console.error('Could not add item', error);
    }
  };

  const updateList = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM shopping');
      setItems(result);
    } catch (error) {
      console.error('Could not get items', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await db.runAsync('DELETE FROM shopping WHERE id=?', [id]);
      await updateList();
    } catch (error) {
      console.error('Could not delete item', error);
    }
  };

  useEffect(() => {
    initialize();
    updateList();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Product'
        onChangeText={setProduct}
        value={product}
        style={styles.input}
      />
      <TextInput
        placeholder='Amount'
        onChangeText={setAmount}
        value={amount}
        style={styles.input}
      />
      <Button onPress={saveItem} title="Save" />
      <Text style={styles.header}>Shopping List</Text>
      <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemcontainer}>
            <Text>{item.product}</Text>
            <Text>{item.amount}</Text>
            <Text style={styles.deleteText} onPress={() => deleteItem(item.id)}>Bought</Text>
          </View>
        )}
        data={items}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
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
