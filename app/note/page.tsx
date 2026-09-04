// 檔案路徑：app/notes/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface NoteItem {
  id: string;
  category: string;
  title: string;
  content: string[];
  updatedAt: string;
}

function NotesContent() {
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get('id');

  // 預設的示範筆記資料（可自由增減或替換）
  const [notes] = useState<NoteItem[]>([
    {
      id: '1',
      category: '入境與海關',
      title: 'VJW 與海關申報提醒',
      content: [
        '飛機上先把SIM卡換好，保存好原來的SIM卡。',
        '出發日前務必填寫完成 Visit Japan Web (VJW)。',
        '抵達關西機場後備妥 QR Code 截圖，加速通關。'
      ],
      updatedAt: '2026-09-04'
    },
    {
      id: '2',
      category: '交通提醒',
      title: 'HARUKA 特快搭乘須知',
      content: [
        '關西機場乘車月台通常位於 4 號月台，請預留 15 分鐘找月台。',
        '劃位票券請妥善保管，車長查票時需出示。'
      ],
      updatedAt: '2026-09-04'
    },
    {
      id: '3',
      category: '交通卡使用',
      title: 'ICOCA票卡使用',
      content: [
        '到京都車站自動售票機購買ICOCA卡，需要2000日圓，500日圓是押金。',
        '離開日本前盡量花光裡面金額，到關西機場退卡，退還500日圓押金。',
        '便利商店跟藥妝店都可以幫忙用現金儲值。'
      ],
      updatedAt: '2026-09-04'
    },
    {
      id: '4',
      category: '生活備忘',
      title: '早餐方式',
      content: [
        '只有第四天(10/12)早上使用飯店早餐。',
        '其他天的早餐盡量在前一天晚上就買好。'
      ],
      updatedAt: '2026-09-04'
    }
  ]);

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
        📝 旅途筆記與重要備忘
      </h1>
      

      {/* 筆記卡片清單 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e1dfdd',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ 
                fontSize: '0.75em', 
                background: '#f1f1ef', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                color: '#787774',
                fontWeight: '500'
              }}>
                {note.category}
              </span>
              <span style={{ fontSize: '0.75em', color: '#9b9a97' }}>{note.updatedAt}</span>
            </div>

            <h2 style={{ fontSize: '1.15em', fontWeight: '600', color: '#37352f', margin: '0 0 10px 0' }}>
              {note.title}
            </h2>

            <ul style={{ margin: 0, paddingLeft: '20px', color: '#494844', fontSize: '0.92em', lineHeight: '1.6' }}>
              {note.content.map((point, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px', color: '#787774' }}>載入筆記中...</div>}>
      <NotesContent />
    </Suspense>
  );
}