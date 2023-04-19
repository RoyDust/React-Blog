import { ironOptions } from '@/config';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { prepareConnection } from '@/db';
import { User } from '@/db/entity';
import { ISession } from 'pages/api/index';
import { EXCEPTION_USER } from '../config/code';

export default withIronSessionApiRoute(detail, ironOptions);

async function detail(req: NextApiRequest, res: NextApiResponse) {
  // 拿到session
  const session: ISession = req.session;
  const { userId } = session;
  console.log("++++++++");

  console.log(req.body);

  const { nickname = '', job = '', introduce = '' } = req.body;

  // 实例化数据库
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: Number(userId)
    }
  })

  if (user) {
    user.nickname = nickname;
    user.job = job;
    user.introduce = introduce;

    const resUser = userRepo.save(user);

    res?.status(200)?.json({
      code: 0,
      msg: "",
      data: resUser
    })
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_USER.NOT_FOUND
    })
  }


}
