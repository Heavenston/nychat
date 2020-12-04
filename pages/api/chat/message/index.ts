import type { NextApiRequest, NextApiResponse } from 'next'
import { authRequest } from '~/utils/userUpdate'
import { generateId } from '~/utils/idGenerator'
import { Message } from '~/utils/dbTypes'
import { MethodRouter } from '~/utils/methodRouter'
import { firestore } from 'firebase-admin'
import type { firestore as FirebaseFirestore } from 'firebase-admin'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.body !== 'object') {
    res.status(400).json({ message: 'Invalid body' })
    return
  }
  const { content } = req.body
  if (typeof content !== 'string') {
    res.status(400).json({ message: 'Body must contain a content' })
    return
  }
  if (content.length > 1000 || content === '') {
    res.status(400).json({ message: "Content can't be empty / over 1000" })
    return
  }

  const user = await authRequest(res, req.headers.authorization)
  if (!user) return
  const userData = user.data()
  if (userData === undefined) return

  const chatRef = userData.chat

  const messageId = generateId()
  const messageRef = (chatRef.collection(
    'messages'
  ) as FirebaseFirestore.CollectionReference<Message>).doc(messageId)
  await messageRef.create({
    author: user.ref,
    content,
    date: firestore.Timestamp.now(),
  })

  res.status(200).end()
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await authRequest(res, req.headers.authorization)
  if (!user) return

  const userData = user.data()
  if (userData === undefined) throw ''

  const messagesCollection = userData.chat.collection(
    'messages'
  ) as FirebaseFirestore.CollectionReference<Message>

  const limit = Number(req.query.limit) ?? 20
  if (typeof limit !== 'number' || isNaN(limit) || limit < 2 || limit > 100) {
    res.status(400).end()
    return
  }

  const before = req.query.before || Date.now()
  if (typeof before !== 'number') {
    res.status(400).end()
    return
  }

  const messagesQuery = await messagesCollection
    .orderBy('date', 'desc')
    .endBefore(firestore.Timestamp.fromMillis(before))
    .limitToLast(limit)
    .get()
  const outputMessages = []

  for (let message of messagesQuery.docs) {
    outputMessages.push({
      id: message.id.toString(),
      date: message.data().date.toMillis(),
      content: message.data().content,
      author: message.data().author.id,
    })
  }
}

export default MethodRouter({
  POST,
  GET,
})
