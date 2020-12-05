import type { NextApiRequest, NextApiResponse } from 'next'
import { chatsCollection, usersCollection } from '~/utils/firebase'
import { generateId } from '~/utils/idGenerator'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return
  if (typeof req.body !== 'object') return

  const { name } = req.body
  if (typeof name !== 'string') return

  const chatId = generateId()
  const adminUserId = generateId()
  const adminUserSecret = generateId(6)

  const adminUserRef = usersCollection.doc(adminUserId)
  adminUserRef.create({
    name: 'User #1',
    secret: adminUserSecret,
    admin: true,
    chat: chatsCollection.doc(chatId),
    date: FirebaseFirestore.Timestamp.now(),
  })
  const adminUser = await adminUserRef.get()
  const adminUserData = adminUser.data()
  if (adminUserData === undefined) throw ''
  const chatRef = chatsCollection.doc(chatId)
  await chatRef.create({
    name,
    users: [adminUserRef],
    date: FirebaseFirestore.Timestamp.now(),
  })
  const chat = await chatRef.get()
  const chatData = chat.data()
  if (chatData === undefined) throw ''

  res.status(200).json({
    user: {
      id: adminUserRef.id.toString(),
      name: adminUserData.name,
      admin: adminUserData.admin ?? false,
    },
    chat: {
      id: chatRef.id,
      name: chatData.name,
      users: (await Promise.all(chatData.users.map(u => u.get()))).map(u => ({
        id: u.id,
        name: u.data()?.name,
        admin: u.data()?.admin ?? false,
      })),
    },
    userSecret: adminUserSecret,
  })
}
