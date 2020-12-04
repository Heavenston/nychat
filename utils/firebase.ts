import * as admin from 'firebase-admin'
import type { Chat, Message, User } from '~/utils/dbTypes'

!admin.apps.length
  ? admin.initializeApp({
      credential: JSON.parse(process.env.FIREBASE_CREDS as string),
      databaseURL: 'https://nychat-7f56f.firebaseio.com',
    })
  : admin.app()

export const firestore = admin.firestore()

export const usersCollection = firestore.collection(
  'users'
) as FirebaseFirestore.CollectionReference<User>
export const chatsCollection = firestore.collection(
  'chats'
) as FirebaseFirestore.CollectionReference<Chat>
