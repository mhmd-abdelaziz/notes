/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { notificationsSetup, onMessageReceived } from './notifications';

// Handle background messages
/*messaging().setBackgroundMessageHandler(async remoteMessage => {
  Alert.alert('Message handled in the background!', JSON.stringify(remoteMessage));

  // Display notification with actions even in background
  await notifee.displayNotification({
    title:
      (remoteMessage.data?.title as string) ||
      remoteMessage.notification?.title ||
      'Background Notification',
    body:
      (remoteMessage.data?.body as string) ||
      remoteMessage.notification?.body ||
      '',
    android: {
      channelId: 'actions',
      actions: [
        {
          title: 'Mark as Read',
          pressAction: { id: 'mark-as-read' },
        },
        {
          title: 'Reply',
          pressAction: { id: 'reply' },
          input: true,
        },
      ],
      importance: 4,
      sound: 'default',
      vibrationPattern: [300, 500],
    },
    ios: {
      categoryId: 'message',
    },
  });
});*/

// Handle background events properly
/*notifee.onBackgroundEvent(async ({ type, detail }) => {
  Alert.alert('Background event:', JSON.stringify({ type, detail }));

  if (type === EventType.ACTION_PRESS) {
    if (detail.pressAction?.id === 'mark-as-read') {
      Alert.alert('Background: Notification marked as read');
      // You can perform any background task here
    } else if (detail.pressAction?.id === 'reply') {
      Alert.alert('Background: User replied:', detail.input);
      // You can handle the reply input here
    }
  }
});*/






function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = React.useState({});
  const [token, setToken] = React.useState('');

  /*useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Request permissions on mount
        await messaging().requestPermission();
        await notifee.requestPermission();

        // Log FCM token for testing
        const fcmToken = await messaging().getToken();
        setToken(fcmToken);
        Alert.alert('FCM Token:', fcmToken);

        // Create Android channel with proper configuration
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: 4, // High importance
          sound: 'default',
          vibrationPattern: [300, 500],
          lights: true,
          lightColor: '#FF0000',
        });

        // Also create a test channel specifically for actions
        await notifee.createChannel({
          id: 'actions',
          name: 'Actions Channel',
          importance: 4,
          sound: 'default',
          vibrationPattern: [300, 500],
          lights: true,
          lightColor: '#FF0000',
        });

        // iOS: Register category for actions
        await notifee.setNotificationCategories([
          {
            id: 'message',
            actions: [
              {
                id: 'mark-as-read',
                title: 'Mark as Read',
              },
              {
                id: 'reply',
                title: 'Reply',
                input: true,
              },
            ],
          },
        ]);

        Alert.alert('Notification setup completed successfully');

        // Debug: List available channels
        const channels = await notifee.getChannels();
        console.log('Available channels:', channels);
        Alert.alert('Available channels:', JSON.stringify(channels));
      } catch (error) {
        console.error('Error setting up notifications:', error);
        Alert.alert('Error setting up notifications:', JSON.stringify(error));
      }
    };

    setupNotifications();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setData(prev => ({ ...prev, remoteMessage }));
      Alert.alert(
        'Foreground message received:',
        JSON.stringify(remoteMessage),
      );

      try {
        // Display a notification with actions
        await notifee.displayNotification({
          title:
            (remoteMessage.data?.title as string) ||
            remoteMessage.notification?.title ||
            'Notification',
          body:
            JSON.stringify(remoteMessage) ||
            (remoteMessage.data?.body as string) ||
            remoteMessage.notification?.body ||
            'New message received',
          android: {
            channelId: 'actions',
            actions: [
              {
                title: 'Mark as Read',
                pressAction: { id: 'mark-as-read' },
              },
              {
                title: 'Reply',
                pressAction: { id: 'reply' },
                input: true,
              },
            ],
            importance: 4, // High importance
            sound: 'default',
            vibrationPattern: [300, 500],
          },
          ios: {
            categoryId: 'message',
          },
        });
        Alert.alert('Notification displayed successfully');
      } catch (error) {
        console.error('Error displaying notification:', error);
        Alert.alert('Error displaying notification:', JSON.stringify(error));
      }
    });

    // Handle foreground action events
    const eventListener = notifee.onForegroundEvent(obj => {
      setData(prev => ({ ...prev, obj }));
      Alert.alert('Notifee event:', JSON.stringify(obj));

      const { type, detail } = obj;

      if (type === EventType.ACTION_PRESS) {
        if (detail.pressAction?.id === 'mark-as-read') {
          Alert.alert('Success', 'Notification marked as read');
        } else if (detail.pressAction?.id === 'reply') {
          Alert.alert('Reply', `You replied: ${detail.input}`);
        }
      }
    });

    return () => {
      unsubscribe();
      eventListener();
    };
  }, []);*/


  useEffect(() => {
    let cleanup = () => { };

    try {
      notificationsSetup();

      cleanup = messaging().onMessage(onMessageReceived);

    } catch (error) {
      Alert.alert('Error subscribing to notifications:', JSON.stringify(error));
    }

    return cleanup;
  }, []);


  const testNotification = async () => {
    try {
      const channelId = await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
        badge: true,
      });

      await notifee.displayNotification({
        title: 'Test Notification with Actions',
        body: 'This notification should have action buttons',
        android: {
          channelId,
          actions: [
            {
              title: 'Mark as Read',
              pressAction: { id: 'mark-as-read' },
            },
            {
              title: 'Reply',
              pressAction: { id: 'reply' },
              input: true,
            },
          ],
          importance: 4,
          sound: 'default',
          vibrationPattern: [300, 500],
        },
        ios: {
          categoryId: 'message',
        },
      });
    } catch (error) {
      Alert.alert('Error sending test notification:', JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text>FCM Token: {token}</Text>
      <Text>Data: {JSON.stringify(data)}</Text>
      <Button title="Test Notification" onPress={testNotification} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NewAppScreen templateFileName="App.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
