import { ironOptions } from "@/config";
import { prepareConnection } from "@/db";
import { Article, User } from "@/db/entity";
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "typeorm";

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  let { tag_id } = req.query || {};
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article)


  let articles: Article[] = [];

  const id = Number(tag_id);
  if (id === 0) {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
    });
  } else {
    articles = await getConnection()
      .createQueryBuilder(Article, 'article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.tags', 'tags')
      .where((qb: any) => {
        qb.where('tags.id = :id', {
          id: Number(tag_id)
        })
      })
      .getMany()


  }

  console.log("过滤后");

  console.log(articles);


  res?.status(200).json({
    code: 0,
    msg: '',
    data: articles || [],
  });

}