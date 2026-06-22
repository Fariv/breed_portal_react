import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const people = {
  threeE: { label: '3E', name: 'Planning 3E', email: 'planning@breed.nl', color: 'magenta' },
  arjan: { label: 'A', name: 'Arjan', email: 'arjan@breed.nl', color: 'blue' },
  karel: { label: 'K', name: 'Karel Breed', email: 'karel@breed.nl', color: 'photo', img: 'https://i.pravatar.cc/48?img=12' },
  kitty: { label: 'K', name: 'Kitty', email: 'kitty@breed.nl', color: 'cyan' }
};

const initialCards = [
  { id: 'p1', lane: 0, title: 'Penninga - 1333', activities: ['Upholstery', 'Measuring'], date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', resources: ['threeE', 'arjan', 'karel', 'kitty'] },
  { id: 'v1', lane: 0, title: 'Vonk - 1333', activities: ['Upholstery'], date: '15 Jun 2026', startTime: '08:00 AM', endTime: '06:00 PM', resources: ['threeE'] },
  { id: 's1', lane: 0, title: 'Stairs - 1333', activities: ['Painting'], date: '15 Jun 2026', startTime: '08:00 AM', endTime: '06:00 PM', resources: ['kitty'] },
  { id: 'p2', lane: 1, title: 'Penninga - 1333', activities: ['Upholstery'], date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', resources: ['threeE', 'arjan', 'karel', 'kitty'], muted: true },
  { id: 'r1', lane: 1, title: 'Reus - 1333', activities: ['Wallpaper'], date: '16 Jun 2026', startTime: '10:00 AM', endTime: '04:00 PM', resources: ['arjan'] },
  { id: 'w1', lane: 1, title: 'Wouters - 1333', activities: ['Electrical'], date: '16 Jun 2026', startTime: '10:00 AM', endTime: '04:00 PM', resources: ['kitty'] },
  { id: 'p3', lane: 2, title: 'Penninga - 1333', activities: ['Upholstery', 'Measuring'], date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', resources: ['threeE', 'arjan', 'karel', 'kitty'] },
  { id: 'd1', lane: 2, title: 'Van Dansik - 1333', activities: ['Curtains'], date: '17 Jun 2026', startTime: '08:00 AM', endTime: '06:00 PM', resources: ['arjan'] },
  { id: 'sc1', lane: 2, title: 'Schrauwen - 1333', activities: ['Wallpaper'], date: '17 Jun 2026 - 19 Jun 2026', startTime: '09:00 AM', endTime: '05:00 PM', resources: ['threeE', 'arjan'] },
  { id: 'st1', lane: 3, title: 'Stammis - 1333', activities: ['Curtains'], date: '18 Jun 2026', startTime: '08:15 AM', endTime: '11:00 AM', resources: ['threeE', 'arjan'] },
  { id: 'm1', lane: 3, title: 'Marisa-Hassing - 1333', activities: ['Assembly'], date: '18 Jun 2026', startTime: '08:15 AM', endTime: '11:00 AM', resources: ['arjan'] },
  { id: 'sch2', lane: 4, title: 'Schrauwen - 1333', activities: ['Wallpaper'], date: '19 Jun 2026', startTime: '08:00 AM', endTime: '05:00 PM', resources: ['threeE', 'arjan'] },
  { id: 'el1', lane: 4, title: 'Elly de Groen - 1333', activities: ['Curtains'], date: '19 Jun 2026', startTime: '08:15 AM', endTime: '10:00 AM', resources: ['karel'] }
];

function isoWeekStart(week, isoYear) {
  const simple = new Date(isoYear, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay() || 7;
  const monday = new Date(simple);
  if (dayOfWeek <= 4) monday.setDate(simple.getDate() - dayOfWeek + 1);
  else monday.setDate(simple.getDate() + 8 - dayOfWeek);
  return monday;
}
function formatShort(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
}
function formatRange(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
}

function Login({ onLogin }) {
  return <section className="login-page">
    <div className="login-card">
      <Brand />
      <h1>Portal Login</h1>
      <p>Sign in to continue to Related Planning Data.</p>
      <label>Username</label>
      <input placeholder="Enter username" />
      <label>Password</label>
      <input type="password" placeholder="Enter password" onKeyDown={(e) => e.key === 'Enter' && onLogin()} />
      <button onClick={onLogin}>Login</button>
      <small>No credentials needed for this prototype.</small>
    </div>
  </section>;
}

function Brand() {
  return <div className="brand"><div className="brand-mark">B</div><div className="brand-text"><strong>breed</strong><span>Interieur</span></div></div>;
}

function Header() {
  const nav = ['CUSTOMERS', 'PROJECTS', 'PLANNING LINES', 'SALES', 'PURCHASE', 'MESSAGE VIEW', 'TABLES', 'SYSTEM'];
  return <header className="portal-header">
    <Brand />
    <nav className="portal-nav">{nav.map((item) => <a key={item} href="#">{item}{item !== 'PLANNING LINES' && item !== 'MESSAGE VIEW' ? <span>⌄</span> : null}</a>)}</nav>
    <div className="user-area"><span>Hello <b>Karel 2</b></span><img src="https://i.pravatar.cc/80?img=12" alt="Karel" /></div>
  </header>;
}

function ResourceAvatar({ id }) {
  const person = people[id];
  const tooltip = `${person.name} | ${person.email}`;
  if (person.img) return <img src={person.img} alt={person.name} data-tooltip={tooltip} />;
  return <span className={`avatar ${person.color}`} data-tooltip={tooltip}>{person.label}</span>;
}

function Card({ card, onDragStart }) {
  return <article className={`planning-card ${card.muted ? 'muted' : ''}`} draggable onDragStart={() => onDragStart(card.id)}>
    <div className="corner-fold" />
    <h3>{card.title}</h3>
    <div className="chips">{card.activities.map((activity) => <span key={activity} className={`pill ${activity.toLowerCase()}`}>{activity}</span>)}</div>
    <div className="data-list">
      <p><b>Date:</b> {card.date}</p>
      <p><b>Start time:</b> {card.startTime}</p>
      <p><b>End time:</b> {card.endTime}</p>
    </div>
    <footer>
      <div className="resource-stack">{card.resources.map((resource) => <ResourceAvatar key={resource} id={resource} />)}</div>
      <span className="person-count" title={`${card.resources.length} resources`}>👥 {card.resources.length}</span>
    </footer>
  </article>;
}

function Lane({ index, label, today, cards, onDropCard, draggedId, setDraggedId }) {
  return <div className={`date-lane ${today ? 'today' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={() => onDropCard(index)}>
    <div className="date-head"><span>{label}</span>{today && <strong>Today</strong>}<em>{cards.length}</em></div>
    {cards.map((card) => <Card key={card.id} card={card} onDragStart={setDraggedId} />)}
  </div>;
}

function MainApp() {
  const [week, setWeek] = useState(25);
  const [cards, setCards] = useState(initialCards);
  const [query, setQuery] = useState('');
  const [draggedId, setDraggedId] = useState(null);
  const dates = useMemo(() => {
    const monday = isoWeekStart(week, 2026);
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      return d;
    });
  }, [week]);
  const rangeText = `${formatRange(dates[0])} - ${formatRange(dates[4])} 2026`;
  const shownCards = cards.filter((card) => card.title.toLowerCase().includes(query.toLowerCase()) || card.activities.join(' ').toLowerCase().includes(query.toLowerCase()));
  const moveCard = (lane) => {
    if (!draggedId) return;
    setCards((current) => current.map((card) => card.id === draggedId ? { ...card, lane, muted: false } : card));
    setDraggedId(null);
  };
  return <div className="app-shell">
    <Header />
    <main className="related-page">
      <section className="related-toolbar">
        <div className="toolbar-title">
          <h1>Related Planning Data</h1>
          <p>Only project related planning lines for project <b>1333</b>. Drag cards between date columns.</p>
        </div>
        <div className="toolbar-actions">
          <div className="week-control">
            <button className="nav-round" onClick={() => setWeek((w) => Math.max(1, w - 1))}>‹</button>
            <span className="week-badge">W{week}</span>
            <select value={week} onChange={(e) => setWeek(Number(e.target.value))}>{[23,24,25,26,27,28].map((w) => <option key={w} value={w}>W{w}</option>)}</select>
            <strong>{rangeText}</strong>
            <button className="nav-round" onClick={() => setWeek((w) => Math.min(53, w + 1))}>›</button>
          </div>
          <div className="toolbar-search"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search related data" /></div>
        </div>
      </section>
      <section className="date-board-wrap">
        <div className="date-board">
          {dates.map((date, index) => <Lane key={index} index={index} label={formatShort(date)} today={index === 2} cards={shownCards.filter((card) => card.lane === index)} onDropCard={moveCard} draggedId={draggedId} setDraggedId={setDraggedId} />)}
        </div>
      </section>
    </main>
  </div>;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <MainApp /> : <Login onLogin={() => setLoggedIn(true)} />;
}

createRoot(document.getElementById('root')).render(<App />);
