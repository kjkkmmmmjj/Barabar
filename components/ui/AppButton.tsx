import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { colors } from '@/constants/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    switch (type) {
      case 'secondary':
        return [
          styles.button,
          styles.secondaryButton,
          disabled && styles.disabledButton,
          style,
        ];
      case 'outline':
        return [
          styles.button,
          styles.outlineButton,
          disabled && styles.disabledOutlineButton,
          style,
        ];
      default:
        return [
          styles.button,
          styles.primaryButton,
          disabled && styles.disabledButton,
          style,
        ];
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case 'secondary':
        return [styles.buttonText, styles.secondaryButtonText, textStyle];
      case 'outline':
        return [styles.buttonText, styles.outlineButtonText, textStyle];
      default:
        return [styles.buttonText, styles.primaryButtonText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          color={type === 'outline' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.background,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  disabledOutlineButton: {
    borderColor: colors.disabled,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'InterMedium',
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
  },
  outlineButtonText: {
    color: colors.primary,
  },
});

export default AppButton;