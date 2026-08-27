// 檔案路徑：app/page.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '../lib/supabase';

interface EventItem {
  start_time: string;
  end_time: string;
  category: string;
  content: string;
  transportation: string;
  notes: string;
  image_url: string;
}

interface DayData {
  dayNumber: number;
  title: string;
  dateString: string;
  events: EventItem[];
}

interface Itinerary {
  id: string;
  title: string;
  days: DayData[];
}

const getCategoryStyle = (category: string) => {
  switch (category) {
    case '交通': return { icon: 'fa-train' };
    case '景點': return { icon: 'fa-camera' };
    case '美食': return { icon: 'fa-utensils' };
    case '住宿': return { icon: 'fa-bed' };
    default: return { icon: 'fa-map-pin' };
  }
};

// 新增：將純文字中的網址轉換為超連結的輔助函式
const renderTextWithLinks = (text: string) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#0ea5e9', textDecoration: 'underline', wordBreak: 'break-all' }}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function ItineraryPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setIsLoading(true);
      
      const { data: rawData, error } = await supabase
        .from('itineraries')
        .select(`
          id,
          title,
          itinerary_events (
            event_date,
            start_time,
            end_time,
            category,
            content,
            transportation,
            notes,
            image_url
          )
        `);

      if (error) {
        console.error("Supabase 讀取錯誤:", error.message, error.details);
        return; 
      }

      const formattedData: Itinerary[] = (rawData || []).map((itinerary: any) => {
        const events = itinerary.itinerary_events || [];
        
        const datesSet = new Set<string>();
        events.forEach((event: any) => {
          if (event.event_date) datesSet.add(event.event_date);
        });
        const uniqueDates = Array.from(datesSet).sort();

        return {
          id: itinerary.id,
          title: itinerary.title,
          days: uniqueDates.map((dateStr, index) => {
            const dayNum = index + 1; 
            const dateObj = new Date(dateStr);
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            const dateString = `${month}/${day}`;

            return {
              dayNumber: dayNum,
              title: `Day ${dayNum}`,
              dateString: dateString,
              events: events
                .filter((event: any) => event.event_date === dateStr)
                .sort((a: any, b: any) => (a.start_time || '').localeCompare(b.start_time || ''))
                .map((e: any) => ({
                  start_time: e.start_time || '',
                  end_time: e.end_time || '',
                  category: e.category || '',
                  content: e.content || '',
                  transportation: e.transportation || '',
                  notes: e.notes || '',
                  image_url: e.image_url || ''
                }))
            };
          })
        };
      });

      setItineraries(formattedData);
      if (formattedData.length > 0) {
        setSelectedItineraryId(formattedData[0].id);
      }
      
    } catch (err) {
      console.error("資料處理發生例外錯誤:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItineraryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedItineraryId(e.target.value);
    setExpandedNotes(new Set());
  };

  const toggleNote = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  if (isLoading) return <div style={{textAlign: 'center', marginTop: '100px', color: '#787774'}}>載入中...</div>;
  if (!itineraries.length) return <div style={{textAlign: 'center', marginTop: '100px', color: '#787774'}}>目前沒有行程資料</div>;

  const currentItinerary = itineraries.find(item => item.id === selectedItineraryId);

  return (
    <main>
      <div className="notion-cover"></div>
      <div className="notion-page">
        <div className="notion-icon-wrapper"><i className="fa-solid fa-plane"></i></div>
        <h1 className="notion-title">{currentItinerary?.title || '旅程檢視'}</h1>

        <div className="notion-controls">
          <select 
            className="notion-select" 
            value={selectedItineraryId || ''} 
            onChange={handleItineraryChange}
          >
            {itineraries.map(itinerary => (
              <option key={itinerary.id} value={itinerary.id}>
                {itinerary.title}
              </option>
            ))}
          </select>
        </div>

        {currentItinerary && currentItinerary.days.length > 0 && (
          <div className="notion-board-container">
            {currentItinerary.days.map((day) => (
              <div className="notion-board-column" key={day.dayNumber}>
                <div className="notion-board-header">
                  {day.title} {day.dateString}
                </div>
                
                {day.events.map((event, index) => {
                  const tagStyle = getCategoryStyle(event.category);
                  
                  let displayTime = event.start_time;
                  if (event.start_time && event.end_time) {
                    displayTime = `${event.start_time} - ${event.end_time}`;
                  }
                  
                  const uniqueNoteId = `${day.dayNumber}-${index}`;
                  const isNoteExpanded = expandedNotes.has(uniqueNoteId);
                  
                  return (
                    <div className="notion-card" key={index}>
                      {event.image_url && (
                        <img src={event.image_url} alt={event.content} className="notion-card-image" />
                      )}
                      
                      <div className="notion-card-content">
                        <h3 className="notion-card-title">
                          <i className={`fa-solid ${tagStyle.icon}`} style={{ color: '#9ca3af', fontSize: '0.9em', marginTop: '3px' }}></i>
                          {event.content}
                        </h3>
                        
                        <div className="notion-tags">
                          {displayTime && (
                            <span className="notion-tag">
                              {displayTime}
                            </span>
                          )}
                          {event.category && (
                            <span className="notion-tag">
                              {event.category}
                            </span>
                          )}
                          {event.transportation && (
                            <span className="notion-tag">
                              <i className="fa-solid fa-plane"></i> {event.transportation}
                            </span>
                          )}
                        </div>

                        {event.notes && (
                          <div style={{ marginTop: '6px' }}>
                            <button
                              onClick={() => toggleNote(uniqueNoteId)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '4px 0',
                                color: 'var(--notion-text-muted)',
                                fontSize: '0.85em',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                outline: 'none'
                              }}
                            >
                              <span style={{ fontSize: '0.8em', width: '12px', textAlign: 'center' }}>
                                {isNoteExpanded ? '▼' : '▶'}
                              </span>
                              備註
                            </button>
                            
                            {isNoteExpanded && (
                              <p className="notion-meta" style={{ marginTop: '2px' }}>
                                {/* 修改：使用輔助函式渲染備註內容 */}
                                {renderTextWithLinks(event.notes)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}