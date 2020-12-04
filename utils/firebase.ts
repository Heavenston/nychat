import * as admin from 'firebase-admin'
import type { Chat, Message, User } from '~/utils/dbTypes'

!admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
  : admin.app()

export const firestore = admin.firestore()

export const usersCollection = firestore.collection(
  'users'
) as FirebaseFirestore.CollectionReference<User>
export const chatsCollection = firestore.collection(
  'chats'
) as FirebaseFirestore.CollectionReference<Chat>
