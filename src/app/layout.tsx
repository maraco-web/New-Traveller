import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TravelKit — 你的萬用旅行助理',
  description: '規劃行程、搜尋機票住宿、探索景點餐廳、追蹤旅遊預算。一個 App，搞定所有旅行大小事。',
  keywords: ['旅行', '行程規劃', '機票搜尋', '旅遊預算', '景點探索'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif' }} className="antialiased">
        {children}
      </body>
    </html>
  );
}
