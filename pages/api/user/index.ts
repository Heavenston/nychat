import { firestore } from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'
import { usersCollection } from '~/utils/firebase'
import { generateId } from '~/utils/idGenerator'
import { MethodRouter } from '~/utils/methodRouter'
import { authRequest } from '~/utils/userUpdate'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body
  let { username, admin } = body || {}
  admin ??= false

  if (
    !(typeof username === 'string' || typeof username === 'undefined') ||
    typeof admin !== 'boolean'
  ) {
    res.status(400).end()
    return
  }

  const user = await authRequest(res, req.headers.authorization, true)
  if (!user) return
  const userData = user.data()
  if (userData === undefined) throw ''

  const chatRef = userData.chat

  if (!username) {
    const chat = await chatRef.get()
    const chatData = chat.data()
    if (chatData === undefined) throw ''

    username = `User #${chatData.users.length + 1}`
  }

  const newUserId = generateId()
  const newUserSecret = generateId(6)
  const newUserRef = usersCollection.doc(newUserId)
  await newUserRef.create({
    chat: chatRef,
    date: firestore.Timestamp.now(),
    name: username,
    secret: newUserSecret,
    admin,
  })

  await chatRef.update({
    users: firestore.FieldValue.arrayUnion(newUserRef),
  })

  res.status(200).json({
    id: user.id,
    name: userData.name,
    admin: userData.admin ?? false,
  })
}

export default MethodRouter({
  POST,
})
