import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { componentStyles } from '../styles';

interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export default function AddModal({ visible, onClose, onAddExpense, onAddIncome }: AddModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={componentStyles.modalOverlay} onPress={onClose}>
        <View style={componentStyles.modalContainer}>
          <Pressable onPress={() => {}}>
            {/* Modal Header */}
            <View style={componentStyles.modalHeader}>
              <Text style={componentStyles.modalTitle}>Add Transaction</Text>
              <TouchableOpacity onPress={onClose} style={componentStyles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View style={componentStyles.modalContent}>
              <TouchableOpacity
                style={componentStyles.modalButton}
                onPress={onAddExpense}
                activeOpacity={0.7}
              >
                <View style={componentStyles.modalButtonIconContainer}>
                  <MaterialCommunityIcons name="cash-minus" size={32} color="#FF6B6B" />
                </View>
                <View style={componentStyles.modalButtonContent}>
                  <Text style={componentStyles.modalButtonTitle}>Expense</Text>
                  <Text style={componentStyles.modalButtonSubtitle}>Record a new expense</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7E848D" />
              </TouchableOpacity>

              <TouchableOpacity
                style={componentStyles.modalButton}
                onPress={onAddIncome}
                activeOpacity={0.7}
              >
                <View style={componentStyles.modalButtonIconContainer}>
                  <MaterialCommunityIcons name="cash-plus" size={32} color="#4CAF50" />
                </View>
                <View style={componentStyles.modalButtonContent}>
                  <Text style={componentStyles.modalButtonTitle}>Income</Text>
                  <Text style={componentStyles.modalButtonSubtitle}>Record a new income</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7E848D" />
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}