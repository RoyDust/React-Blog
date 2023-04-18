import { ironOptions } from '@/config';
import { prepareConnection } from '@/db';
import { Tag } from '@/db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from 'pages/api/index';
import { getConnection } from "typeorm";

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  const db = await prepareConnection();
  const tagRepo = db.getRepository(Tag);

  let followTags = await getConnection()
    .createQueryBuilder(Tag, 'tag')
    .leftJoinAndSelect('tag.users', 'users')
    .where((qb: any) => {
      qb.where('users.id = :id', {
        id: Number(userId)
      })
    })
    .getMany();


  // const followTags = await tagRepo.find({
  //   relations: ['users'],
  //   where: {
  //     users_id: userId
  //   }
  // where: ((qb) => {
  //   qb.where('user_id = :id', {
  //     id: Number(userId)
  //   })
  // })
  // })

  const allTags = await tagRepo.find({
    relations: ['users']
  })

  res.status(200)?.json({
    code: 0,
    msg: "",
    data: {
      followTags,
      allTags
    }
  })
}