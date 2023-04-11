import { IronSession } from 'iron-session';

export type ISession = IronSession &
  Record<String, any> & {
    verifyCode?: number,
    userId?: number,
    nickname?: string,
    avatar?: string,
  };
