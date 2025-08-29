import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        // 🔁 Aqui você pode enviar esse token para sua API
        // para depois enviar notificações programadas
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida no app:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuário interagiu com a notificação:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken };
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Notificações só funcionam em dispositivos físicos.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permissão para notificações foi negada!');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}
