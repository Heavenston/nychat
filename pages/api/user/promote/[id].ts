import type { NextApiRequest, NextApiResponse } from 'next'
import { usersCollection } from '../../../../utils/firebase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).end()
    return
  }
  const targetId = req.query.id
  if (typeof targetId !== 'string') return
  const secret = req.headers.authorization
  if (typeof secret !== 'string') return

  const adminUserQuery = await usersCollection
    .where('secret', '==', secret)
    .limit(1)
    .get()
  if (adminUserQuery.empty || adminUserQuery.docs[0].data()?.admin === false) {
    res.status(401).json({
      message: 'Unauthorized',
    })
    return
  }
  const adminUser = adminUserQuery.docs[0]

  const targetUserRef = usersCollection.doc(targetId)
  const targetUser = await targetUserRef.get()

  if (
    !targetUser.exists ||
    targetUser.data()?.chat !== adminUser.data()?.chat
  ) {
    res.status(404).json({
      message: `User ${targetId} does not exist`,
    })
    return
  }
  if (targetUser.data()?.admin === true) {
    res.status(400).json({
      message: 'User is already an admin',
    })
    return
  }

  targetUserRef.update({
    admin: true,
  })
}
