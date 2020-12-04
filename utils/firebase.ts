import * as admin from 'firebase-admin'
import type { Chat, Message, User } from '~/utils/dbTypes'

const fromB64 = (t: string) => Buffer.from(t, 'base64').toString()

const creds = JSON.parse(fromB64(process.env.GCLOUD_CREDENTIALS as string))
console.log(creds)
!admin.apps.length
  ? admin.initializeApp({
      credential: creds,
    })
  : admin.app()

export const firestore = admin.firestore()

export const usersCollection = firestore.collection(
  'users'
) as FirebaseFirestore.CollectionReference<User>
export const chatsCollection = firestore.collection(
  'chats'
) as FirebaseFirestore.CollectionReference<Chat>
