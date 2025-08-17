import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';

import { initializeDB, addExpense, getExpenses } from './db';

const categories = ['Makan', 'Transportasi', 'Jajan', 'Lainnya'];

export default function ExpenseTracker() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    initializeDB();
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      const today = dayjs().format('YYYY-MM-DD');
      const total = data
        .filter(item => item.date.startsWith(today))
        .reduce((sum, item) => sum + Number(item.amount), 0);
      setTotalToday(total);
    } catch (err) {
      console.error('Error loading expenses:', err);
    }
  };

  const handleSave = async () => {
    if (!amount) return;
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
    try {
      await addExpense(parseFloat(amount), category, note, date);
      setAmount('');
      setNote('');
      setCategory(categories[0]);
      loadExpenses();
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.expenseText}>
        {dayjs(item.date).format('DD MMM YYYY HH:mm')}
      </Text>
      <Text style={styles.expenseText}>
        {item.category}: Rp{item.amount}
      </Text>
      {item.note ? <Text style={styles.noteText}>{item.note}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>
        Total Pengeluaran Hari Ini: Rp{totalToday}
      </Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Nominal"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
        <Picker
          selectedValue={category}
          onValueChange={value => setCategory(value)}
          style={styles.picker}
        >
          {categories.map(cat => (
            <Picker.Item label={cat} value={cat} key={cat} />
          ))}
        </Picker>
        <TextInput
          placeholder="Catatan (opsional)"
          value={note}
          onChangeText={setNote}
          style={styles.input}
        />
        <Button title="Simpan" onPress={handleSave} />
      </View>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
  },
  totalText: {
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 16,
  },
  expenseItem: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 4,
  },
  expenseText: {
    fontSize: 14,
  },
  noteText: {
    fontStyle: 'italic',
  },
});
