import { ironOptions } from '@/config';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { prepareConnection } from '@/db';
import { setCookie } from '@/utils';
import { Cookie } from 'next-cookie';
import { User, UserAuth } from '@/db/entity';
import { ISession } from 'pages/api/index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  // 拿到session
  const session: ISession = req.session;
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  // 拿到cookie
  const cookie = Cookie.fromApiRoute(req, res);

  // 实例化数据库
  const db = await prepareConnection();
  // const userRepo = db.getRepository(User);
  const userAuthRepo = db.getRepository(UserAuth);

  if (String(session.verifyCode) === String(verify)) {
    // 验证码正确，在user_auth 表中查找 identity_type 是否有记录
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: ['user'],
    });
    // console.log('userAuth', userAuth);

    if (userAuth) {
      // 已存在用户
      console.log('已经存在了');
      const user = userAuth.user;
      const { id, nickname, avatar } = user;

      // 设置session
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      // 设置cookie
      setCookie(cookie, { id, nickname, avatar });

      res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    } else {
      // 新用户，自动注册
      const user = new User();
      user.nickname = `用户_${phone}`;
      user.avatar = '/images/avatar.png';
      user.job = '这个人没有写呢';
      user.introduce = '这个人好懒，没有写简介呢';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = String(session.verifyCode);
      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      // 设置cookie
      setCookie(cookie, { id, nickname, avatar });

      // console.log('resUserAuth', resUserAuth);
      res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    // console.log(session.verifyCode);

    res?.status(200).json({
      code: -1,
      msg: '验证码错误',
    });
  }
}
