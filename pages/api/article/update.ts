import { ironOptions } from '@/config';
import { prepareConnection } from '@/db';
import { Article, User } from '@/db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from 'pages/api/index';
import { EXCEPTION_ARTICLE } from 'pages/api/config/code'

export default withIronSessionApiRoute(update, ironOptions);

// 第三方登录
async function update(req: NextApiRequest, res: NextApiResponse) {
  const { title = "", content = "", id } = req.body;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);

  const article = await articleRepo.findOne({
    where: {
      id: id
    },
    relations: ['user']
  })
  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();


    const resArticle = await articleRepo.save(article);

    console.log("resArticle", resArticle);

    if (resArticle) {
      res.status(200).json({
        code: 0,
        msg: '文章发布成功',
        data: {
          resArticle
        },
      })
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED })
    }
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUNT })
  }
}