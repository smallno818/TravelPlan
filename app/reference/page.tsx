// 檔案路徑：app/reference/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

interface StaticLinkItem {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
}

function ReferenceContent() {
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get('id');
  
  const [links, setLinks] = useState<StaticLinkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("目前接收到的 itineraryId:", itineraryId); // 👈 可在瀏覽器 F12 主控台檢查
    if (itineraryId) {
      fetchStaticLinks(itineraryId);
    } else {
      setIsLoading(false);
    }
  }, [itineraryId]);

  const fetchStaticLinks = async (targetId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('static_links')
        .select('*')
        .eq('itinerary_id', targetId);

      if (error) {
        console.error("讀取靜態連結錯誤:", error.message);
        return;
      }

      console.log("從 Supabase 成功讀取的靜態資料:", data); // 👈 檢查這裡是否有抓到資料
      setLinks(data || []);
    } catch (err) {
      console.error("發生例外錯誤:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div style={{textAlign: 'center', marginTop: '100px', color: '#787774'}}>載入中...</div>;

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
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
          ← 返回行程主頁
        </Link>
      </div>

      <h1 style={{ fontSize: '2em', fontWeight: '700', color: '#37352f', marginBottom: '8px' }}>
        📌 旅途參考店家與地圖
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {links.length > 0 ? (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#ffffff',
                border: '1px solid #e1dfdd',
                borderRadius: '8px',
                padding: '16px',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2em' }}>🔗</span>
                {link.category && (
                  <span style={{ fontSize: '0.75em', background: '#f1f1ef', padding: '2px 6px', borderRadius: '4px', color: '#787774' }}>
                    {link.category}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1em', fontWeight: '600', color: '#37352f', margin: '0' }}>
                {link.title}
              </h3>
              {link.description && (
                <p style={{ fontSize: '0.85em', color: '#787774', margin: '0', lineHeight: '1.4' }}>
                  {link.description}
                </p>
              )}
            </a>
          ))
        ) : (
          <div style={{ color: '#787774', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            目前此行程尚無新增的靜態連結，或資料庫中的 itinerary_id 未與此行程配對。
          </div>
        )}
      </div>
    </main>
  );
}

export default function ReferencePage() {
  return (
    <Suspense fallback={<div style={{textAlign: 'center', marginTop: '100px', color: '#787774'}}>載入中...</div>}>
      <ReferenceContent />
    </Suspense>
  );
}