import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const PUBLIC_PATH = /\.(.*)$/;

// 中间件处理
export function middleware(req: NextRequest) {

  // 1.上报日志
  if (!PUBLIC_PATH.test(req?.nextUrl?.pathname)) {
    console.log("日志");
    console.log(req.nextUrl.href);
    console.log(req.referrer);
    console.log(req.geo);
    // 接口上报
  }


  // if (req?.nextUrl?.pathname == '/info') {
  //   return NextResponse?.redirect("http://localhost:3000/user/2")
  // }

  // return NextResponse.rewrite(req.url)
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/:path*', '/dashboard/:path*'],
}