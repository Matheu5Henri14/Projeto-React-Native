import { Alert, Platform } from 'react-native';

export function confirmAction({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  destructive = false,
  onConfirm,
}) {
  if (Platform.OS === 'web') {
    // No navegador, window.confirm devolve true (OK) ou false (Cancelar)
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    {
      text: confirmText,
      style: destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}