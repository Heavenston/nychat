import type { NextApiRequest, NextApiResponse } from 'next'
import { MethodRouter } from '~/utils/methodRouter'
import { authRequest } from '~/utils/userUpdate'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body
  if (typeof body !== 'object') {
    res.status(400).end()
    return
  }
  let { username, admin } = body
  admin ??= false

  if (typeof username !== 'string' || typeof admin !== 'boolean') {
    res.status(400).end()
    return
  }

  const user = await authRequest(res, req.headers.authorization, true)
  if (!user) return
  const userData = user.data()
  if (userData === undefined) throw ''

  const chatRef = userData.chat
  const chat = await chatRef.get()
  const chatData = chat.data()
  if (chatData === undefined) throw ''

  username ??= `User #${chatData.users.length + 1}`

  chatRef.update({})
}

export default MethodRouter({
  POST,
})
