import type { firestore } from 'firebase-admin'

export interface User {
  name: string
  secret: string
  chat: firestore.DocumentReference<Chat>
  admin?: boolean
  date: FirebaseFirestore.Timestamp
}

export interface Chat {
  name: string
  users: firestore.DocumentReference<User>[]
  date: FirebaseFirestore.Timestamp
}

export interface Message {
  author: firestore.DocumentReference<User>
  content: string
  date: FirebaseFirestore.Timestamp
}
