// 檔案路徑：app/briefing/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 行前說明的章節資料結構
interface BriefingSection {
  id: string;
  icon: string;
  title: string;
  items: string[];
}

function BriefingContent() {
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get('id');

  // 👇 你可以在此處隨時增修或直接貼入你的行前說明文字
  const briefingData: BriefingSection[] = [
    {
      id: 'meeting',
      icon: '🛫',
      title: '集合與航班提醒',
      items: [
        '10/9 早上4:20計程車會來家裡接送，大概3:50就要起床準備了',
        '10/9 傍晚爸爸把車開到外面，晚上我跟阿珍洗完澡才過來，我的車會停車庫',
        '早上會餓的話可以提前準備小東西，飛機起飛後可能半小時就有東西吃了'
      ]
    },
    {
      id: 'entry',
      icon: '📝',
      title: '入境日本須知 (Visit Japan Web)',
      items: [
        '入海關用提前發的QR Code掃描',
        '到機場拿完行李會去換Haruka電車的票',
        '肚子的話不趕搭車先吃點東西，飯店也有免費點心'
      ]
    },
    {
      id: 'currency',
      icon: '💴',
      title: '金錢與支付',
      items: [
        '到京都車站會買ICOCA交通卡給爸媽一人一張',
        '坐地鐵或巴士都刷這張卡，大部分的商店也可以刷要保管好'
      ]
    },
    {
      id: 'Traffic',
      icon: '🚅',
      title: '交通',
      items: [
        '京都車站到飯店走路6分鐘就到',
        '飯店名稱：京都站前Richmond Premier飯店 (リッチモンドホテルプレミア京都駅前)'
      ]
    },
    {
      id: 'Food',
      icon: '🍽️',
      title: '飲食',
      items: [
        '飯店13:00後有提供下午茶點心免費使用',
        '飯店早餐只有一天會吃，其他都是提前一天買好，或是出發早上再找早餐店'
      ]
    },
    {
      id: 'weather',
      icon: '🧥',
      title: '氣候與穿著建議',
      items: [
        '氣溫大概16-29度，早晚比較涼而已'
      ]
    },
    {
      id: 'emergency',
      icon: '🆘',
      title: '緊急聯絡與重要備忘',
      items: [
        '臨時分開找不到人，手機google跟line都可以分享你的位置',
        '身體不舒服或太累不想出門都可以在飯店休息，附近有超商可以買東西吃'
      ]
    }
  ];

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      {/* 頂部返回導覽 */}
      <div style={{ marginBottom: '24px' }}>
        <Link 
          href="/" 
          style={{ 
            color: '#0ea5e9', 
            textDecoration: 'none', 
            fontSize: '0.9em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← 返回行程主看板
        </Link>
      </div>

      <h1 style={{ fontSize: '2em', fontWeight: '700', color: '#37352f', marginBottom: '8px' }}>
        📢 旅途行前說明會
      </h1>

      {/* 說明會區塊列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {briefingData.map((section) => (
          <div
            key={section.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e1dfdd',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <h2 style={{ fontSize: '1.2em', fontWeight: '600', color: '#37352f', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </h2>

            <ul style={{ margin: 0, paddingLeft: '20px', color: '#494844', fontSize: '0.95em', lineHeight: '1.7' }}>
              {section.items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function BriefingPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px', color: '#787774' }}>載入行前說明中...</div>}>
      <BriefingContent />
    </Suspense>
  );
}