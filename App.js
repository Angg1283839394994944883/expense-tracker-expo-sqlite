import React from 'react';
import { StatusBar } from 'expo-status-bar';
import ExpenseTracker from './ExpenseTracker';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <ExpenseTracker />
    </>
  );
}
