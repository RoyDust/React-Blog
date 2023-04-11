import { format } from 'date-fns';
import { withIronSessionApiRoute } from 'iron-session/next';
import md5 from 'md5';
import { encode } from 'js-base64';
import { NextApiRequest, NextApiResponse } from 'next';
import request from '@/service/fetch';
import { ironOptions } from '@/config';
import { ISession } from 'pages/api/index';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

// 发送短信验证 （荣联云）
async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  // 在使用withIronSessionApiRoute包裹函数后可以使用session
  const session: ISession = req.session;

  const { to = '', templateId = '1' } = req.body;
  const AppId = '2c94811c870df4c801876581bc7e0dc7';
  const AccountId = '2c94811c870df4c801876581bb120dc0';
  const AuthToken = '901a973149614f96898ee50b0121ff34';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);

  // const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;  
  // ! 自定义验证码不可用，只能用0000
  const verifyCode = Number('0000')
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );

  console.log(response);

  // 解构response
  const { statusCode, statusMsg,templateSMS } = response as any;
  if (statusCode === '000000') {
    // 如果返回值是000000 那就将verifyCode验证码存到session里面
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
      code: 0,
      msg: statusMsg,
      verifyCode:verifyCode,
      data:{
        templateSMS
      }
    });
  }else{
  res.status(200).json({
    code: statusCode,
    msg: statusMsg,
  });
  }
}
