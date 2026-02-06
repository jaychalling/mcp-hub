import './globals.css';

export const metadata = {
  title: 'MCP Hub',
  description: 'MCP 서버 아이디어를 8인 전문가 패널로 검증',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
