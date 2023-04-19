import { ironOptions } from '@/config';
import { prepareConnection } from '@/db';
import { Article, Tag, User } from '@/db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from 'pages/api/index';
import { EXCEPTION_ARTICLE } from 'pages/api/config/code'

export default withIronSessionApiRoute(publish, ironOptions);

// 第三方登录
async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = "", content = "", tagIds = [] } = req.body;
  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  const tagRepo = db.getRepository(Tag); 

  // 拿到user表信息
  const user = await userRepo.findOne({
    where: {
      id: session.userId
    }
  })

  // 拿到tag表信息
  const tags = await tagRepo.find({
    where: tagIds?.map((tagId: number) => ({ id: tagId }))
  })

  // 新建一个文章实例
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


  // 处理tag
  if (tags) {
    const newTags = tags?.map(tag => {
      tag.article_count = tag.article_count + 1;
      return tag
    })
    article.tags = newTags;
  }

  console.log("article", article);
  const resArticle = await articleRepo.save(article);

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