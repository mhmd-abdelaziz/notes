import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidAction, AndroidImportance, IOSNotificationCategoryAction } from '@notifee/react-native';

export const NOTIFICATIONS_CHANNEL_ID = 'default';
export const NOTIFICATIONS_CHANNEL_NAME = 'Default Channel';
export const NOTIFICATIONS_WITH_ACTIONS_CHANNEL_ID = 'actions';
export const NOTIFICATIONS_WITH_ACTIONS_CHANNEL_NAME = 'Notifications Actions';
export const requestAndroidActiions: AndroidAction[] = [
  { pressAction: { id: 'snooze' }, title: 'Snooze' },
  { pressAction: { id: 'mark-as-read' }, title: 'Mark as Read' },
  { pressAction: { id: 'reply' }, title: 'Reply', input: true },
];
export const requestIosActiions: IOSNotificationCategoryAction[] = [
  { id: 'snooze', title: 'Snooze' },
  { id: 'mark-as-read', title: 'Mark as Read' },
  { id: 'reply', title: 'Reply', input: true },
];

export const notificationsSetup = async () => {
  try {
    // Request permissions on mount
    await messaging().requestPermission();
    await notifee.requestPermission();

    // Log FCM token for testing
    const fcmToken = await messaging().getToken();
    Alert.alert('FCM Token:', fcmToken);

    messaging().subscribeToTopic('all')
      .then(() => Alert.alert('Successfully subscribed to topic "all"'))
      .catch(error => Alert.alert('Failed to subscribe to topic "all": ' + JSON.stringify(error)));

    // Create channels
    await notifee.createChannel({
      id: NOTIFICATIONS_CHANNEL_ID,
      name: NOTIFICATIONS_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });
    await notifee.createChannel({
      id: NOTIFICATIONS_WITH_ACTIONS_CHANNEL_ID,
      name: NOTIFICATIONS_WITH_ACTIONS_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });

    // Set notification categories (ios)
    await notifee.setNotificationCategories([
      {
        id: NOTIFICATIONS_WITH_ACTIONS_CHANNEL_ID,
        actions: requestIosActiions,
      },
    ]);

  } catch (error) {
    Alert.alert('Error setting up notifications:', JSON.stringify(error));
  }
}

export const onMessageReceived = async (remoteMessage: any) => {
  //await notifee.cancelAllNotifications();

  if (remoteMessage?.data?.type === 'actions') {
    await notifee.displayNotification({
      title: remoteMessage?.data?.type || "",
      body: remoteMessage?.data?.body || "",
      android: {
        pressAction: { id: 'default' },
        channelId: NOTIFICATIONS_WITH_ACTIONS_CHANNEL_ID,
        actions: requestAndroidActiions,
      },
      ios: {
        categoryId: NOTIFICATIONS_WITH_ACTIONS_CHANNEL_ID,
      },
    });
  } else {
    // await notifee.displayNotification({
    //   title: remoteMessage.notification.title,
    //   body: remoteMessage.notification.body,
    //   android: {
    //     pressAction: { id: 'default' },
    //     channelId: NOTIFICATIONS_CHANNEL_ID,
    //   },
    //   ios: {
    //     categoryId: NOTIFICATIONS_CHANNEL_ID,
    //   },
    // });
  }
};
