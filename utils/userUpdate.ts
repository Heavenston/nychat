import type { NextApiRequest, NextApiResponse } from 'next'
import type { Chat, Message, User } from '../dbTypes'
import { usersCollection } from './firebase'

export async function authRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  requireAdmin: boolean = false
): Promise<FirebaseFirestore.DocumentSnapshot<User> | false> {
  const secret = req.headers.authorization
  if (typeof secret !== 'string') {
    res.status(400).end()
    return false
  }

  const userQuery = await usersCollection
    .where('secret', '==', secret)
    .limit(1)
    .get()
  if (userQuery.empty || userQuery.docs[0].data()?.admin === false) {
    res.status(401).json({
      message: 'Unauthorized',
    })
    return false
  }
  const user = userQuery.docs[0]

  if (requireAdmin && !user.get('admin')) {
    res.status(401).json({
      message: 'Unauthorized',
    })
    return false
  }

  return user
}

export async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  requireAdmin: boolean = false,
  targetMustNotBeAdmin: boolean = false
): Promise<
  | false
  | {
      adminUser: FirebaseFirestore.DocumentSnapshot<User>
      targetUser: FirebaseFirestore.DocumentSnapshot<User>
    }
> {
  const targetId = req.query.id
  if (typeof targetId !== 'string') {
    res.status(400).end()
    return false
  }
  const secret = req.headers.authorization
  if (typeof secret !== 'string') {
    res.status(400).end()
    return false
  }

  const adminUserQuery = await usersCollection
    .where('secret', '==', secret)
    .limit(1)
    .get()
  if (adminUserQuery.empty || adminUserQuery.docs[0].data()?.admin === false) {
    res.status(401).json({
      message: 'Unauthorized',
    })
    return false
  }
  const adminUser = adminUserQuery.docs[0]

  if (requireAdmin && !adminUser.get('admin')) {
    res.status(401).json({
      message: 'Unauthorized',
    })
    return false
  }

  const targetUserRef = usersCollection.doc(targetId)
  const targetUser = await targetUserRef.get()

  if (!targetUser.exists || targetUser.get('chat') !== adminUser.get('chat')) {
    res.status(404).json({
      message: `Target user does not exist`,
    })
    return false
  }
  if (targetMustNotBeAdmin && targetUser.get('admin') === true) {
    res.status(400).json({
      message: "Target user can't be an admin",
    })
    return false
  }

  return { adminUser, targetUser }
}
