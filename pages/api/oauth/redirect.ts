import { ironOptions } from '@/config';
import { prepareConnection } from '@/db';
import { User, UserAuth } from '@/db/entity';
import request from '@/service/fetch';
import { setCookie } from '@/utils';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { Cookie } from 'next-cookie';
import { ISession } from 'pages/api/index';


export default withIronSessionApiRoute(redirect, ironOptions);

// 第三方登录
async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  // http://localhost:3000/api/oauth/redirect?code=xxxxx
  const { code } = req?.query || {};
  console.log(code);
  // 拿到github的oauth2和密码
  const githubClientID = '1443ed301b9c096e0e1d';
  const githubSecrect = "e5dd196108a426a7bbdc0bc1f0cfb60a2efa94e0";
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecrect}&code=${code}`;

  // 发送请求获取到access_token
  const result = await request.post(url, {},
    {
      headers: {
        accept: "application/json"
      }
    }
  );
  console.log("result", result);

  const { access_token } = result as any;
  console.log("access_token", access_token);

  // 再带上access_token发送登录请求，获取到用户的信息
  const githubUserInfo = await request.get('https://api.github.com/user',
    {
      headers: {
        accept: 'application/json',
        Authorization: `token ${access_token}`
      }
    }
  );

  console.log("githubUserInfo");
  console.log(githubUserInfo);

  const cookies = Cookie.fromApiRoute(req, res);
  const db = await prepareConnection()
  // 在数据库里面是否已经存在该用户，如果存在则直接登录，如果不存在就先注册
  const userAuth = await db.getRepository(UserAuth).findOne({
    where: {
      identity_type: "github",
      identifier: githubClientID
    },
    relations: ['user'],
  })
  console.log("userAuth:", userAuth);


  if (userAuth) {
    // 如果之前登录过的用户，直接从user里面获取到用户信息，并且更新
    const user = userAuth.user;
    const { id, nickname, avatar } = user;
    console.log("user", user);

    // 更新凭证
    userAuth.credential = access_token;
    // 设置session
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();
    // 设置cookie
    setCookie(cookies, { id, nickname, avatar });

    res.redirect('/');

  } else {
    // 创建一个新用户
    const { login = "", avatar_url = "" } = githubUserInfo as any;
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;
    user.job = '暂无';
    user.introduce = '这个人很懒，没有写介绍';

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientID;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);

    console.log("resUserAuth:", resUserAuth);

    const { id, nickname, avatar } = resUserAuth?.user || {};
    // 设置session
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();
    // 设置cookie
    setCookie(cookies, { id, nickname, avatar });

    res.redirect('/');
  }
}