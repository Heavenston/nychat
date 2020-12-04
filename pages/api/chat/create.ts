import type { NextApiRequest, NextApiResponse } from 'next'
import { chatsCollection, usersCollection } from '../../../utils/firebase'
import { generateId } from '../../../utils/idGenerator'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return
  if (typeof req.body !== 'object') return

  const { name } = req.body
  if (typeof name !== 'string') return

  const chatId = generateId()
  const adminUserId = generateId()
  const adminUserSecret = generateId(6)

  const adminUser = await usersCollection.add({
    name: 'User #1',
    secret: adminUserSecret,
    admin: true,
    chat: chatsCollection.doc(chatId),
    date: FirebaseFirestore.Timestamp.now(),
  })
  const chat = chatsCollection.doc(chatId)
  chat.create({
    name,
    users: [adminUser],
    date: FirebaseFirestore.Timestamp.now(),
  })

  res.status(200).json({
    userId: adminUserId,
    userSecret: adminUserSecret,
    chatId,
  })
}
