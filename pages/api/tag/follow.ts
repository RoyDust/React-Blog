import { ironOptions } from '@/config';
import { prepareConnection } from '@/db';
import { Tag, User } from '@/db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from 'pages/api/index';
import { EXCEPTION_TAG, EXCEPTION_USER } from '../config/code';

export default withIronSessionApiRoute(follow, ironOptions);

async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  const { tagId, type } = req?.body || {};
  const db = await prepareConnection();
  const tagRepo = db.getRepository(Tag);
  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: userId
    }
  })

  console.log("tagId", tagId);


  const tag = await tagRepo.findOne({
    relations: ['users'],
    where: {
      id: tagId
    }
  })

  console.log(user);
  console.log(tag);



  if (!user) {
    res?.status(200).json({
      ...EXCEPTION_USER?.NOT_LOGIN
    })
    return;
  }

  if (!tag?.users) {
    res?.status(200).json({
      ...EXCEPTION_USER?.NOT_LOGIN
    })
    return;
  }

  // 如果关注就在tag的users加入当前user并且count++,反之亦然
  if (tag?.users) {
    if (type === 'follow') {
      tag.users = tag?.users?.concat([user])
      tag.follow_count = tag?.follow_count + 1;
    } else if (type === 'unFollow') {
      tag.users = tag?.users?.filter((user) => user.id !== userId)
      tag.follow_count = tag?.follow_count - 1;
    }
  }

  if (tag) {
    const resTag = await tagRepo?.save(tag);
    res?.status(200)?.json({
      code: 0,
      msg: "",
      data: resTag
    })
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_TAG.FOLLOW_FAILED
    })
  }

}