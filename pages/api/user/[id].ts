import type { NextApiRequest, NextApiResponse } from 'next'
import { usersCollection } from '~/utils/firebase'
import { updateUser } from '~/utils/userUpdate'
import { MethodRouter } from '~/utils/methodRouter'

// Get a user and it's chat
const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const updateUserResult = await updateUser(req, res, true)
  if (!updateUserResult) return
  const { targetUser } = updateUserResult
  const userData = targetUser.data()
  if (userData == undefined) throw ''

  const chat = await userData.chat.get()
  const chatData = chat?.data()
  if (chat === undefined || chatData === undefined) throw ''

  res.status(200).json({
    id: targetUser.id,
    name: userData.name,
    admin: userData.admin ?? false,
    chat: {
      id: chat.id,
      name: chatData.name,
      users: (await Promise.all(chatData.users.map(u => u.get()))).map(u => ({
        id: u.id,
        name: u.data()?.name,
        admin: u.data()?.admin ?? false,
      })),
    },
  })
}
// Delete a user from the same chat and not admin
const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const updateUserResult = await updateUser(req, res, true, true)
  if (!updateUserResult) return
  const { targetUser } = updateUserResult
  await targetUser.ref.delete()
  res.status(200).end()
}

export default MethodRouter({
  GET,
  DELETE,
})
