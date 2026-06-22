import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const people = {
  threeE: { name: 'Planning 3E', label: '3E', color: 'magenta', email: 'planning3e@breed.nl' },
  arjan: { name: 'Arjan', label: 'A', color: 'blue', email: 'arjan@breed.nl' },
  karel: { name: 'Karel Breed', label: 'K', color: '', email: 'karel@breed.nl', img: 'https://i.pravatar.cc/80?img=12' },
  kitty: { name: 'Kitty', label: 'K', color: 'cyan', email: 'kitty@breed.nl' },
};

const initialCards = [
  { id: 'p1', lane: 0, customer: 'Penninga', projectId: '1333', description: 'PVC floor laying', instruction: 'Install PVC floor in living room', hours: '10.0 h', remaining: '2.0 h', date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Middenweg 522', backoffice: 'https://projectselect.eu/instructions/view/penninga-pvc-floor', remarks: 'Customer requested morning installation', activities: ['Upholstery', 'Measuring'], resources: ['threeE', 'arjan', 'karel', 'kitty'], contact: 'Karel Breed' },
  { id: 'v1', lane: 0, customer: 'Vonk', projectId: '1333', description: 'Equalising floor - Roberto', instruction: '104.5 m2 net', hours: '8.0 h', remaining: '1.0 h', date: '15 Jun 2026', startTime: '08:00 AM', endTime: '06:00 PM', week: 'W25', status: 'Planning', location: 'Workshop', backoffice: 'https://projectselect.eu/instructions/view/vonk-equalising', remarks: 'Workshop preparation', activities: ['Upholstery'], resources: ['threeE'], contact: 'Roberto' },
  { id: 'p2', lane: 1, customer: 'Penninga', projectId: '1333', description: 'PVC floor laying', instruction: 'Continue living room installation', hours: '10.0 h', remaining: '2.0 h', date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Middenweg 522', backoffice: 'https://projectselect.eu/instructions/view/penninga-pvc-floor', remarks: 'Same planning line continues', activities: ['Upholstery'], resources: ['threeE', 'arjan', 'karel', 'kitty'], muted: true, contact: 'Mrs. Penninga' },
  { id: 'r1', lane: 1, customer: 'Reus', projectId: '1333', description: 'Wallpapering', instruction: 'Pierre has details', hours: '6.0 h', remaining: '1.5 h', date: '16 Jun 2026', startTime: '10:00 AM', endTime: '04:00 PM', week: 'W25', status: 'Execution', location: 'Middenweg 522', backoffice: 'https://projectselect.eu/instructions/view/reus-wallpaper', remarks: 'Confirm wall preparation', activities: ['Wallpaper'], resources: ['arjan'], contact: 'Arjan' },
  { id: 'p3', lane: 2, customer: 'Penninga', projectId: '1333', description: 'PVC floor laying', instruction: 'Install PVC floor in living room', hours: '10.0 h', remaining: '2.0 h', date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Middenweg 522', backoffice: 'https://projectselect.eu/instructions/view/penninga-pvc-floor', remarks: 'Customer requested morning installation', activities: ['Upholstery', 'Measuring'], resources: ['threeE', 'arjan', 'karel', 'kitty'], contact: 'Karel Breed' },
  { id: 'd1', lane: 2, customer: 'Van Dansik', projectId: '1333', description: 'Curtains installation', instruction: '1 spreader not installed correctly', hours: '4.0 h', remaining: '1.0 h', date: '17 Jun 2026', startTime: '08:00 AM', endTime: '06:00 PM', week: 'W25', status: 'Execution', location: 'Middenweg 522', backoffice: 'https://projectselect.eu/instructions/view/dansik-curtains', remarks: 'Bring replacement part', activities: ['Curtains'], resources: ['arjan'], contact: 'Karel Breed' },
  { id: 'st1', lane: 3, customer: 'Stammis', projectId: '1333', description: 'Place curtains + jalousie', instruction: 'Use customer note', hours: '2.5 h', remaining: '0.5 h', date: '18 Jun 2026', startTime: '08:15 AM', endTime: '11:00 AM', week: 'W25', status: 'Execution', location: 'Workshop', backoffice: 'https://projectselect.eu/instructions/view/stammis-curtains', remarks: 'Workshop delivery', activities: ['Curtains'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 'm1', lane: 3, customer: 'Marisa-Hassing', projectId: '1333', description: 'Assembly work', instruction: 'Confirm parts before arrival', hours: '2.0 h', remaining: '1.0 h', date: '18 Jun 2026', startTime: '08:15 AM', endTime: '11:00 AM', week: 'W25', status: 'Planning', location: 'Workshop', backoffice: 'https://projectselect.eu/instructions/view/marisa-assembly', remarks: 'Morning appointment', activities: ['Assembly'], resources: ['arjan'], contact: 'Arjan' },
  { id: 'sch2', lane: 4, customer: 'Schrauwen', projectId: '1333', description: 'Wallpapering', instruction: 'Responsible: Sjoerd', hours: '8.0 h', remaining: '3.0 h', date: '19 Jun 2026', startTime: '08:00 AM', endTime: '05:00 PM', week: 'W25', status: 'Planning', location: 'Middenweg 522', backoffice: 'https://projectselect.eu/instructions/view/schrauwen-friday', remarks: 'Check final wall', activities: ['Wallpaper'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
];

const activities = ['Upholstery', 'Measuring', 'Wallpaper', 'Curtains', 'Assembly', 'Painting', 'Electrical'];
const contacts = ['Karel Breed', 'Mrs. Penninga', 'Sjoerd', 'Roberto', 'Arjan', 'Kitty Stoop'];
const weeks = [23, 24, 25, 26, 27, 28];

function isoWeekStart(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const day = simple.getDay() || 7;
  const monday = new Date(simple);
  if (day <= 4) monday.setDate(simple.getDate() - day + 1);
  else monday.setDate(simple.getDate() + 8 - day);
  return monday;
}
function formatShort(date) { return date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }); }
function singleDate(dateText) { return (dateText || '').split('-')[0].trim(); }
function toDateInput(dateText, timeText) {
  const first = singleDate(dateText); const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  const parts = first.split(' '); if (parts.length < 3) return '';
  let [day, mon, year] = parts; day = String(parseInt(day, 10)).padStart(2, '0');
  let [time, ampm] = (timeText || '09:00 AM').split(' '); let [hh, mm] = time.split(':').map(Number);
  if (ampm === 'PM' && hh < 12) hh += 12; if (ampm === 'AM' && hh === 12) hh = 0;
  return `${year}-${months[mon]}-${day}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
function fromDateInput(value) {
  if (!value) return { date: '', time: '' };
  const d = new Date(value);
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
}

function Brand() { return <div className="brand"><div className="brand-mark">B</div><div className="brand-text"><strong>breed</strong><span>Interieur</span></div></div>; }
function Avatar({ id, mini = false }) {
  const p = people[id];
  if (!p) return null;
  const cls = mini ? 'mini-avatar' : 'avatar';
  if (p.img) return <img className={mini ? 'mini-avatar' : undefined} src={p.img} alt={p.name} data-tooltip={`${p.name} | ${p.email}`} />;
  return <span className={`${cls} ${p.color || ''}`} data-tooltip={`${p.name} | ${p.email}`}>{p.label}</span>;
}
function Card({ card, onOpen, onDragStart }) {
  return <article className={`planning-card ${card.muted ? 'muted' : ''}`} draggable onDragStart={() => onDragStart(card.id)} onClick={() => onOpen(card.id)}>
    <div className="corner-fold" />
    <h3>{card.customer} - {card.projectId}</h3>
    <div className="chips">{card.activities.map(a => <span key={a} className={`pill ${a.toLowerCase()}`}>{a}</span>)}</div>
    <div className="data-list"><p><b>Date:</b> {card.date}</p><p><b>Start time:</b> {card.startTime}</p><p><b>End time:</b> {card.endTime}</p></div>
    <footer><span className="person-count" title={`${card.resources.length} resources`}>👥 {card.resources.length}</span><div className="resource-stack">{card.resources.map(id => <Avatar key={id} id={id} />)}</div></footer>
  </article>;
}
function InlineMultiPicker({ selected, options, renderOptionLabel, onChange, type }) {
  const [open, setOpen] = useState(false);
  const toggle = value => onChange(selected.includes(value) ? selected.filter(x => x !== value) : [...selected, value]);
  return <div className={`inline-picker ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
    <div className="selected-line">
      {selected.length ? selected.map(item => type === 'resource'
        ? <span className="resource-token" key={item}><Avatar id={item} mini /><span>{people[item]?.name || item}</span></span>
        : <span className="activity-token" key={item}><button type="button" onClick={(e) => { e.stopPropagation(); onChange(selected.filter(x => x !== item)); }}>×</button>{item}</span>)
        : <span className="picker-empty">Select {type === 'resource' ? 'resources' : 'activities'}</span>}
    </div>
    <button className="picker-add" type="button">+</button>
    {open && <div className="picker-menu" onClick={(e) => e.stopPropagation()}>{options.map(opt => <div className={`picker-option ${selected.includes(opt) ? 'selected' : ''}`} key={opt} onClick={() => toggle(opt)}>{renderOptionLabel(opt)}{selected.includes(opt) && <span className="checkmark">✓</span>}</div>)}</div>}
  </div>;
}
function DetailModal({ card, onClose, onSave }) {
  const [form, setForm] = useState(null);
  React.useEffect(() => {
    if (!card) return;
    setForm({ ...card, startDateTime: toDateInput(card.date, card.startTime), endDateTime: toDateInput(card.date, card.endTime) });
  }, [card]);
  if (!card || !form) return null;
  const save = () => {
    const start = fromDateInput(form.startDateTime); const end = fromDateInput(form.endDateTime);
    onSave({ ...card, description: form.description, date: end.date && end.date !== start.date ? `${start.date} - ${end.date}` : (start.date || card.date), startTime: start.time || card.startTime, endTime: end.time || card.endTime, resources: form.resources, activities: form.activities, contact: form.contact, remarks: form.remarks });
  };
  return <div className="modal-backdrop open" aria-hidden="false" onClick={onClose}>
    <div className="detail-modal house-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
      <div className="modal-top house-modal-top"><div className="modal-heading"><span className="status-readonly" aria-label="Status">{form.status === 'Execution' ? 'Execution' : form.status}</span></div><button className="modal-close" aria-label="Close" onClick={onClose}>×</button></div>
      <div className="modal-body house-modal-body">
        <div className="house-title"><h3>{form.customer} - {form.projectId}</h3><textarea className="desc-field" rows="2" aria-label="Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div className="modal-workspace"><div>
          <section className="modal-section-card"><h4>Planning</h4><div className="field-list">
            <div className="field-row"><label>Start date and time</label><input type="datetime-local" value={form.startDateTime || ''} onChange={e => setForm({ ...form, startDateTime: e.target.value })} /></div>
            <div className="field-row"><label>End date and time</label><input type="datetime-local" value={form.endDateTime || ''} onChange={e => setForm({ ...form, endDateTime: e.target.value })} /></div>
            <div className="field-row compact-row"><label>Resource</label><InlineMultiPicker selected={form.resources || []} options={Object.keys(people)} type="resource" renderOptionLabel={(id) => <><Avatar id={id} mini /><span>{people[id].name}</span></>} onChange={(resources) => setForm({ ...form, resources })} /></div>
            <div className="field-row compact-row"><label>Activity</label><InlineMultiPicker selected={form.activities || []} options={activities} type="activity" renderOptionLabel={(a) => <span>{a}</span>} onChange={(activities) => setForm({ ...form, activities })} /></div>
          </div></section>
          <section className="modal-section-card"><h4>Custom fields</h4><div className="field-list">
            <div className="field-row"><label>Customer contact</label><select value={form.contact || 'Karel Breed'} onChange={e => setForm({ ...form, contact: e.target.value })}>{contacts.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="field-row"><label>Instructions</label><a className="readonly-link" href={form.backoffice || '#'} target="_blank" rel="noopener">{form.instruction || form.backoffice || 'Open instruction'}</a></div>
          </div></section>
          <section className="modal-section-card"><h4>Remarks</h4><div className="field-list"><div className="field-row"><label>Remarks</label><textarea rows="4" value={form.remarks || ''} onChange={e => setForm({ ...form, remarks: e.target.value })} /></div></div></section>
        </div></div>
      </div>
      <div className="modal-actions house-actions"><button className="modal-btn" type="button" onClick={onClose}>Close</button><button className="modal-btn primary" type="button" onClick={save}>Save changes</button></div>
    </div>
  </div>;
}
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [week, setWeek] = useState(25);
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState(initialCards);
  const [draggedId, setDraggedId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const dates = useMemo(() => { const monday = isoWeekStart(week, 2026); return Array.from({ length: 5 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; }); }, [week]);
  const shown = cards.filter(c => (c.customer + ' ' + c.projectId + ' ' + c.description + ' ' + c.activities.join(' ')).toLowerCase().includes(query.toLowerCase()));
  const activeCard = cards.find(c => c.id === activeId);
  if (!loggedIn) return <section className="login-page"><div className="login-card"><Brand /><h1>Portal Login</h1><p>Sign in to continue to Related Planning Data.</p><label>Username</label><input placeholder="Enter username" /><label>Password</label><input type="password" placeholder="Enter password" onKeyDown={e => e.key === 'Enter' && setLoggedIn(true)} /><button onClick={() => setLoggedIn(true)}>Login</button><small>No credentials needed for this prototype.</small></div></section>;
  return <div className="app-shell">
    <header className="portal-header"><Brand /><nav className="portal-nav"><a href="#">CUSTOMERS <span>⌄</span></a><a href="#">PROJECTS <span>⌄</span></a><a href="#">PLANNING LINES</a><a href="#">SALES <span>⌄</span></a><a href="#">PURCHASE <span>⌄</span></a><a href="#">MESSAGE VIEW</a><a href="#">TABLES <span>⌄</span></a><a href="#">SYSTEM <span>⌄</span></a></nav><div className="user-area"><span>Hello <b>Karel 2</b></span><img src="https://i.pravatar.cc/80?img=12" alt="Karel" /></div></header>
    <main className="related-page"><section className="related-toolbar"><div className="toolbar-title"><h1>Related Planning Data</h1><p>Only project related planning lines for project <b>1333</b>. Drag cards between date columns.</p></div><div className="toolbar-actions"><div className="week-control"><button className="nav-round" onClick={() => setWeek(w => Math.max(1, w - 1))}>‹</button><span className="week-badge">W{week}</span><select value={week} onChange={e => setWeek(Number(e.target.value))}>{weeks.map(w => <option key={w} value={w}>W{w}</option>)}</select><strong>{formatShort(dates[0])} - {formatShort(dates[4])} 2026</strong><button className="nav-round" onClick={() => setWeek(w => Math.min(53, w + 1))}>›</button></div><div className="toolbar-search"><input placeholder="Search related data" value={query} onChange={e => setQuery(e.target.value)} /></div></div></section>
      <section className="date-board-wrap"><div className="date-board">{dates.map((d, i) => { const laneCards = shown.filter(c => c.lane === i); return <div className={`date-lane ${i === 2 ? 'today' : ''}`} key={i} onDragOver={e => e.preventDefault()} onDrop={() => { if (draggedId) { setCards(cs => cs.map(c => c.id === draggedId ? { ...c, lane: i, muted: false } : c)); setDraggedId(null); } }}><div className="date-head"><span>{formatShort(d)}</span>{i === 2 && <strong>Today</strong>}<em>{laneCards.length}</em></div>{laneCards.map(card => <Card key={card.id} card={card} onOpen={setActiveId} onDragStart={setDraggedId} />)}</div>; })}</div></section>
    </main>
    <DetailModal card={activeCard} onClose={() => setActiveId(null)} onSave={(updated) => { setCards(cs => cs.map(c => c.id === updated.id ? updated : c)); setActiveId(null); }} />
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
