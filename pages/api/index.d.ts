import { IUserInfo } from '@/store/userStore';
import { IronSession } from 'iron-session';

// 文章类型
export type IArticle = {
  id: number;
  nickname: string;
  title: string;
  views: number;
  content: string;
  create_time: Date;
  update_time: Date;
  user: IUserInfo;
  comments: IComment[]
}

// 评论类型
export type IComment = {
  id: number,
  create_time: Date,
  update_time: Date,
  content: string,
  user: IUserInfo;
}

// session 类型
export type ISession = IronSession &
  Record<String, any> & {
    verifyCode?: number,
    userId?: number,
    nickname?: string,
    avatar?: string,
  };
