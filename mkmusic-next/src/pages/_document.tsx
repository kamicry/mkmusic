import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <script src="/js/jquery.min.js"></script>
        <script src="/js/jquery.mCustomScrollbar.concat.min.js"></script>
        <script src="/plugins/layer/layer.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
