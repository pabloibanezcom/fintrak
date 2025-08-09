import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { InvestmentType } from '@fintrak/shared-types';

interface AddInvestmentFormProps {
  onClose: () => void;
}

export default function AddInvestmentForm({ onClose }: AddInvestmentFormProps) {
  const { addInvestment } = usePortfolio();
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    type: 'crypto' as InvestmentType,
    purchasePrice: '',
    currentPrice: '',
    quantity: '',
    purchaseDate: new Date(),
  });

  const investmentTypes: { value: InvestmentType; label: string }[] = [
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'index_fund', label: 'Index Fund' },
    { value: 'stock', label: 'Stock' },
    { value: 'etf', label: 'ETF' },
  ];

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an investment name');
      return;
    }
    if (!formData.symbol.trim()) {
      Alert.alert('Error', 'Please enter a symbol');
      return;
    }
    if (!formData.purchasePrice || isNaN(Number(formData.purchasePrice))) {
      Alert.alert('Error', 'Please enter a valid purchase price');
      return;
    }
    if (!formData.currentPrice || isNaN(Number(formData.currentPrice))) {
      Alert.alert('Error', 'Please enter a valid current price');
      return;
    }
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    addInvestment({
      name: formData.name.trim(),
      symbol: formData.symbol.trim().toUpperCase(),
      type: formData.type,
      purchasePrice: Number(formData.purchasePrice),
      currentPrice: Number(formData.currentPrice),
      quantity: Number(formData.quantity),
      purchaseDate: formData.purchaseDate,
    });

    onClose();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Add Investment</Text>
        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.background }]}>
          <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Investment Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Bitcoin, S&P 500"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Symbol</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={formData.symbol}
            onChangeText={(text) => setFormData({ ...formData, symbol: text })}
            placeholder="e.g., BTC, SPY"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Type</Text>
          <View style={styles.typeSelector}>
            {investmentTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  formData.type === type.value && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setFormData({ ...formData, type: type.value })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: colors.textSecondary },
                    formData.type === type.value && { color: '#fff', fontWeight: '600' },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Purchase Price ($)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={formData.purchasePrice}
            onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Current Price ($)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={formData.currentPrice}
            onChangeText={(text) => setFormData({ ...formData, currentPrice: text })}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
            value={formData.quantity}
            onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Investment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});