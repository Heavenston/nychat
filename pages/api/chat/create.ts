import type { NextApiRequest, NextApiResponse } from 'next'
import { chatsCollection, usersCollection } from '~/utils/firebase'
import { generateId } from '~/utils/idGenerator'
import { firestore } from 'firebase-admin'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end()
    return
  }
  if (typeof req.body !== 'object') {
    res.status(400).json({
      message: 'Invalid body',
    })
    return
  }

  const { name } = req.body
  if (typeof name !== 'string') {
    res.status(400).json({
      message: 'Invalid chat name',
    })
  }

  const chatId = generateId()
  const adminUserId = generateId()
  const adminUserSecret = generateId(6)

  const adminUserRef = usersCollection.doc(adminUserId)
  await adminUserRef.create({
    name: 'User #1',
    secret: adminUserSecret,
    admin: true,
    chat: chatsCollection.doc(chatId),
    date: firestore.Timestamp.now(),
  })
  const adminUser = await adminUserRef.get()
  const adminUserData = adminUser.data()
  if (adminUserData === undefined) throw ''
  const chatRef = chatsCollection.doc(chatId)
  await chatRef.create({
    name,
    users: [adminUserRef],
    date: firestore.Timestamp.now(),
  })

  res.status(200).json({
    user: {
      id: adminUserRef.id.toString(),
      name: adminUserData.name,
      admin: adminUserData.admin ?? false,
    },
    userSecret: adminUserSecret,
  })
}
