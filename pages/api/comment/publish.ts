import { ironOptions } from '@/config';
import { prepareConnection } from '@/db';
import { Article, Comment, User } from '@/db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from 'pages/api/index';
import { EXCEPTION_COMMENT } from 'pages/api/config/code'

export default withIronSessionApiRoute(publish, ironOptions);

// 第三方登录
async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { articleId = 0, content = '' } = req.body;
  const db = await prepareConnection()
  const commentRepo = db.getRepository(Comment)

  const comments = new Comment();
  comments.content = content;
  comments.create_time = new Date();
  comments.update_time = new Date();

  const user = await db.getRepository(User).findOne({
    where: {
      id: session?.userId
    }
  })

  const article = await db.getRepository(Article).findOne({
    where: {
      id: articleId
    }
  })
  if (user) {
    console.log("user:", user);

    comments.user = user;
  }
  if (article) {
    console.log("article:", article);
    comments.article = article;
  }

  const resComment = await commentRepo.save(comments);
  console.log("resComment:", resComment);


  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: "发表成功",
      data: resComment
    })
  } else {
    res.status(200).json({
      ...EXCEPTION_COMMENT.PUBLISH_FAILED
    })
  }

}