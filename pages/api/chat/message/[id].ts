import type { NextApiRequest, NextApiResponse } from 'next'
import { authRequest } from '~/utils/userUpdate'
import { generateId } from '~/utils/idGenerator'
import { Message } from '~/utils/dbTypes'
import { MethodRouter } from '~/utils/methodRouter'

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const messageId = req.query.id
  if (typeof messageId !== 'string') {
    res.status(400).end()
    return
  }

  const user = await authRequest(req, res)
  if (!user) return
  const userData = user.data()
  if (userData === undefined) throw ''

  const chatRef = userData.chat
  const messageRef = (chatRef.collection(
    'messages'
  ) as FirebaseFirestore.CollectionReference<Message>).doc(messageId)
  const message = await messageRef.get()
  if (!message.exists) {
    res.status(404).end()
    return
  }
  if (message.get('author')?.id !== user.id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  await messageRef.delete()

  res.status(200).end()
}

export default MethodRouter({
  DELETE,
})
