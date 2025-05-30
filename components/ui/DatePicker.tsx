import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange, onClose }) => {
  // On web, we'll use a native date input
  if (Platform.OS === 'web') {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Date</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              <input
                type="date"
                value={date.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  onDateChange(newDate);
                }}
                style={{
                  fontSize: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  width: '100%',
                  fontFamily: 'InterRegular',
                }}
              />
            </View>
            
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onClose}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  
  // On native, we should use DateTimePicker from @react-native-community/datetimepicker
  // But for this example, we'll just show a simple date display
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateDisplay}>
              {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.nativeNote}>
              In a real app, this would be a native date picker component
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onClose}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  datePickerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  dateDisplay: {
    fontFamily: 'InterMedium',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  nativeNote: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: 'InterMedium',
    fontSize: 16,
    color: colors.white,
  },
});

export default DatePicker;