import { ironOptions } from '@/config';
import { prepareConnection } from '@/db';
import { Article, User } from '@/db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from 'pages/api/index';
import { EXCEPTION_ARTICLE } from 'pages/api/config/code'

export default withIronSessionApiRoute(publish, ironOptions);

// 第三方登录
async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = "", content = "" } = req.body;
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);

  const user = await userRepo.findOne({
    where: {
      id: session.userId
    }
  })
  console.log("user:", user);


  const article = new Article()
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  if (user) {
    article.user = user;
  }

  const resArticle = await articleRepo.save(article);

  console.log("article", article);

  if (resArticle) {
    res.status(200).json({
      code: 0,
      msg: '文章发布成功',
      data: {
        resArticle
      },
    })
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED })
  }

}