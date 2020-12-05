import type { NextApiRequest, NextApiResponse } from 'next'
import { Message } from '~/utils/dbTypes'
import { authRequest } from '~/utils/userUpdate'
import { firestore } from 'firebase-admin'

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await authRequest(res, req.headers.authorization)
  if (!user) return
  const userData = user.data()
  if (userData === undefined) throw ''

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/event-stream;charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('X-Accel-Buffering', 'no')

  const chatRef = userData.chat
  const messagesCollection = chatRef.collection(
    'messages'
  ) as FirebaseFirestore.CollectionReference<Message>

  const onChange = async (snap: firestore.QuerySnapshot<Message>) => {
    for (let docChange of snap.docChanges()) {
      if (docChange.type === 'added' || docChange.type === 'modified') {
        const message = docChange.doc
        res.write(
          `data: ${JSON.stringify({
            type: 'messageSend',
            id: message.id.toString(),
            date: message.data().date.toMillis(),
            content: message.data().content,
            author: message.data().author.id,
          })}\n\n`
        )
      } else if (docChange.type === 'removed') {
        const message = docChange.doc
        res.write(
          `data: ${JSON.stringify({
            type: 'messageDelete',
            id: message.id.toString(),
          })}\n\n`
        )
      }
    }
  }

  const cancelOne = messagesCollection
    .orderBy('date')
    .endBefore(firestore.Timestamp.now())
    .limitToLast(20)
    .onSnapshot(onChange)

  const cancelTwo = messagesCollection
    .orderBy('date')
    .startAt(firestore.Timestamp.now())
    .onSnapshot(onChange)

  const cancel = () => {
    cancelOne()
    cancelTwo()
  }

  await new Promise<void>((resolve, reject) => {
    req.on('close', () => {
      res.end()
      cancel()
      resolve()
    })
    req.on('error', e => {
      res.end()
      cancel()
      resolve()
    })
  })
}
