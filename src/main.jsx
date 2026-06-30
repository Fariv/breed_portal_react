import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const people = {
  threeE: { name: 'Planning 3E', label: '3E', color: 'magenta', email: 'planning3e@breed.nl' },
  arjan: { name: 'Arjan', label: 'A', color: 'blue', email: 'arjan@breed.nl' },
  karel: { name: 'Karel Breed', label: 'K', color: '', email: 'karel@breed.nl', img: 'https://i.pravatar.cc/80?img=12' },
  kitty: { name: 'Kitty', label: 'K', color: 'cyan', email: 'kitty@breed.nl' },
};

const initialCards = [
  { id: 'p1', lane: 0, customer: 'Penninga', projectId: '1333', description: 'PVC floor laying', instruction: 'Install PVC floor in living room', hours: '10.0 h', remaining: '2.0 h', date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Middenweg 522, 1098 VK Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/penninga-pvc-floor', remarks: 'Customer requested morning installation', activities: ['Upholstery', 'Measuring'], resources: ['threeE', 'arjan', 'karel', 'kitty'], contact: 'Karel Breed' },
  { id: 'v1', lane: 0, customer: 'Vonk', projectId: '1417', description: 'Equalising floor - Roberto', instruction: '104.5 m2 net', hours: '8.0 h', remaining: '1.0 h', date: '15 Jun 2026 - 16 Jun 2026', startTime: '08:00 AM', endTime: '06:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Herenweg 38, 2105 MH Heemstede', backoffice: 'https://projectselect.eu/instructions/view/vonk-equalising', remarks: 'Workshop preparation', activities: ['Upholstery'], resources: ['threeE'], contact: 'Roberto' },
  { id: 'b1', lane: 0, customer: 'Bakker', projectId: '1524', description: 'Measure curtains', instruction: 'Check window dimensions', hours: '3.0 h', remaining: '0.5 h', date: '15 Jun 2026 - 15 Jun 2026', startTime: '01:00 PM', endTime: '03:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Keizersgracht 110, 1015 CV Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/bakker-curtains', remarks: 'Call before arrival', activities: ['Measuring', 'Curtains'], resources: ['arjan', 'kitty'], contact: 'Kitty Stoop' },
  { id: 'n1', lane: 0, customer: 'Noordhuis', projectId: '1602', description: 'Painting preparation', instruction: 'Prepare wall and cover floor', hours: '5.5 h', remaining: '2.0 h', date: '15 Jun 2026 - 16 Jun 2026', startTime: '09:30 AM', endTime: '02:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Lange Voorhout 25, 2514 EA Den Haag', backoffice: 'https://projectselect.eu/instructions/view/noordhuis-painting', remarks: 'Bring protection foil', activities: ['Painting'], resources: ['karel'], contact: 'Karel Breed' },
  { id: 'a0a', lane: 0, customer: 'Appelman', projectId: '1655', description: 'Curtain fitting', instruction: 'Hang new curtain rails in bedroom', hours: '3.0 h', remaining: '1.0 h', date: '15 Jun 2026 - 15 Jun 2026', startTime: '10:00 AM', endTime: '01:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Prinsengracht 204, 1016 HC Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/appelman-curtains', remarks: 'Rails pre-ordered', activities: ['Curtains'], resources: ['arjan'], contact: 'Arjan' },
  { id: 'a0b', lane: 0, customer: 'De Bruin', projectId: '1710', description: 'Assembly shelves', instruction: 'Mount floating shelves in study', hours: '4.0 h', remaining: '1.5 h', date: '15 Jun 2026 - 15 Jun 2026', startTime: '08:00 AM', endTime: '12:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Leidsestraat 77, 1017 NV Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/debruin-shelves', remarks: 'Customer wants oak finish', activities: ['Assembly'], resources: ['kitty', 'karel'], contact: 'Karel Breed' },
  { id: 'a0c', lane: 0, customer: 'Hoekstra', projectId: '1780', description: 'Floor levelling', instruction: 'Level screed before PVC', hours: '6.0 h', remaining: '2.0 h', date: '15 Jun 2026 - 16 Jun 2026', startTime: '07:30 AM', endTime: '01:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Overtoom 155, 1054 HN Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/hoekstra-levelling', remarks: 'Check moisture content first', activities: ['Measuring', 'Upholstery'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 'a0d', lane: 0, customer: 'Vermeer', projectId: '1841', description: 'Wallpaper living room', instruction: 'Pattern alignment critical', hours: '7.5 h', remaining: '3.0 h', date: '15 Jun 2026 - 16 Jun 2026', startTime: '09:00 AM', endTime: '04:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Herengracht 300, 1016 BX Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/vermeer-wallpaper', remarks: 'Extra rolls in warehouse', activities: ['Wallpaper'], resources: ['arjan', 'kitty'], contact: 'Kitty Stoop' },
  { id: 'a0e', lane: 0, customer: 'Prins', projectId: '1899', description: 'Electrical inspection', instruction: 'Inspect wiring in kitchen', hours: '2.5 h', remaining: '0.5 h', date: '15 Jun 2026 - 15 Jun 2026', startTime: '02:00 PM', endTime: '04:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Vijzelstraat 52, 1017 HG Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/prins-electrical', remarks: 'Bring tester kit', activities: ['Electrical'], resources: ['karel'], contact: 'Karel Breed' },
  { id: 'a0f', lane: 0, customer: 'Meijer', projectId: '1952', description: 'Painting hallway', instruction: 'Two coats required', hours: '5.0 h', remaining: '1.5 h', date: '15 Jun 2026 - 16 Jun 2026', startTime: '08:30 AM', endTime: '01:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Rokin 89, 1012 KL Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/meijer-painting', remarks: 'Use RAL 9010', activities: ['Painting'], resources: ['threeE', 'kitty'], contact: 'Roberto' },

  { id: 'p2', lane: 1, customer: 'Penninga', projectId: '1333', description: 'PVC floor laying', instruction: 'Continue living room installation', hours: '10.0 h', remaining: '2.0 h', date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Middenweg 522, 1098 VK Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/penninga-pvc-floor', remarks: 'Same planning line continues', activities: ['Upholstery'], resources: ['threeE', 'arjan', 'karel', 'kitty'], muted: true, contact: 'Mrs. Penninga' },
  { id: 'r1', lane: 1, customer: 'Reus', projectId: '1748', description: 'Wallpapering', instruction: 'Pierre has details', hours: '6.0 h', remaining: '1.5 h', date: '16 Jun 2026 - 16 Jun 2026', startTime: '10:00 AM', endTime: '04:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Stationsplein 12, 3511 ED Utrecht', backoffice: 'https://projectselect.eu/instructions/view/reus-wallpaper', remarks: 'Confirm wall preparation', activities: ['Wallpaper'], resources: ['arjan'], contact: 'Arjan' },
  { id: 'o1', lane: 1, customer: 'Oostveen', projectId: '1812', description: 'Electrical finishing', instruction: 'Connect lighting in hallway', hours: '4.5 h', remaining: '1.0 h', date: '16 Jun 2026 - 17 Jun 2026', startTime: '09:00 AM', endTime: '01:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Oude Binnenweg 90, 3012 JC Rotterdam', backoffice: 'https://projectselect.eu/instructions/view/oostveen-electrical', remarks: 'Check switch material', activities: ['Electrical'], resources: ['threeE', 'karel'], contact: 'Sjoerd' },
  { id: 'h1', lane: 1, customer: 'Hendriks', projectId: '1904', description: 'Assembly work', instruction: 'Assemble cabinet wall', hours: '7.0 h', remaining: '3.0 h', date: '16 Jun 2026 - 16 Jun 2026', startTime: '11:00 AM', endTime: '05:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Brink 7, 7411 BR Deventer', backoffice: 'https://projectselect.eu/instructions/view/hendriks-assembly', remarks: 'Two people required', activities: ['Assembly'], resources: ['arjan', 'kitty'], contact: 'Roberto' },
  { id: 'a1a', lane: 1, customer: 'Kruijk', projectId: '1960', description: 'PVC floor bedroom', instruction: 'Remove old carpet first', hours: '5.0 h', remaining: '1.5 h', date: '16 Jun 2026 - 16 Jun 2026', startTime: '08:00 AM', endTime: '01:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Buitenhof 44, 2513 AH Den Haag', backoffice: 'https://projectselect.eu/instructions/view/kruijk-pvc', remarks: 'Carpet removal included', activities: ['Upholstery'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 'a1b', lane: 1, customer: 'Van Leeuwen', projectId: '2008', description: 'Measure office space', instruction: 'Full floor plan required', hours: '3.0 h', remaining: '1.0 h', date: '16 Jun 2026 - 16 Jun 2026', startTime: '09:00 AM', endTime: '12:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Hofweg 1, 2511 AA Den Haag', backoffice: 'https://projectselect.eu/instructions/view/vanleeuwen-measure', remarks: 'Send sketch after visit', activities: ['Measuring'], resources: ['kitty'], contact: 'Kitty Stoop' },
  { id: 'a1c', lane: 1, customer: 'Pietersen', projectId: '2066', description: 'Curtain installation', instruction: 'Wave curtains, ceiling mount', hours: '4.5 h', remaining: '2.0 h', date: '16 Jun 2026 - 17 Jun 2026', startTime: '01:00 PM', endTime: '05:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Javastraat 99, 2585 AH Den Haag', backoffice: 'https://projectselect.eu/instructions/view/pietersen-curtain', remarks: 'Ceiling anchors needed', activities: ['Curtains'], resources: ['arjan', 'karel'], contact: 'Arjan' },
  { id: 'a1d', lane: 1, customer: 'Blom', projectId: '2120', description: 'Wall painting', instruction: 'Feature wall in dark blue', hours: '4.0 h', remaining: '1.0 h', date: '16 Jun 2026 - 16 Jun 2026', startTime: '02:00 PM', endTime: '06:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Sophialaan 22, 2514 JP Den Haag', backoffice: 'https://projectselect.eu/instructions/view/blom-painting', remarks: 'Two-tone effect requested', activities: ['Painting'], resources: ['threeE'], contact: 'Roberto' },
  { id: 'a1e', lane: 1, customer: 'Koops', projectId: '2185', description: 'Staircase railing', instruction: 'Replace old wooden railing', hours: '6.5 h', remaining: '2.5 h', date: '16 Jun 2026 - 17 Jun 2026', startTime: '08:30 AM', endTime: '03:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Bezuidenhoutseweg 20, 2594 AV Den Haag', backoffice: 'https://projectselect.eu/instructions/view/koops-railing', remarks: 'Metal railing in stock', activities: ['Assembly'], resources: ['arjan', 'kitty'], contact: 'Kitty Stoop' },
  { id: 'a1f', lane: 1, customer: 'Timmerman', projectId: '2242', description: 'Electrical outlet install', instruction: 'Add 4 outlets in home office', hours: '3.5 h', remaining: '1.0 h', date: '16 Jun 2026 - 16 Jun 2026', startTime: '04:00 PM', endTime: '07:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Laan van NOI 35, 2593 BG Den Haag', backoffice: 'https://projectselect.eu/instructions/view/timmerman-electrical', remarks: 'USB-C outlets requested', activities: ['Electrical'], resources: ['karel'], contact: 'Karel Breed' },

  { id: 'p3', lane: 2, customer: 'Penninga', projectId: '1333', description: 'PVC floor laying', instruction: 'Install PVC floor in living room', hours: '10.0 h', remaining: '2.0 h', date: '15 Jun 2026 - 17 Jun 2026', startTime: '10:00 PM', endTime: '08:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Middenweg 522, 1098 VK Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/penninga-pvc-floor', remarks: 'Customer requested morning installation', activities: ['Upholstery', 'Measuring'], resources: ['threeE', 'arjan', 'karel', 'kitty'], contact: 'Karel Breed' },
  { id: 'd1', lane: 2, customer: 'Van Dansik', projectId: '2017', description: 'Curtains installation', instruction: '1 spreader not installed correctly', hours: '4.0 h', remaining: '1.0 h', date: '17 Jun 2026 - 17 Jun 2026', startTime: '08:00 AM', endTime: '06:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Nieuwegracht 45, 3512 LE Utrecht', backoffice: 'https://projectselect.eu/instructions/view/dansik-curtains', remarks: 'Bring replacement part', activities: ['Curtains'], resources: ['arjan'], contact: 'Karel Breed' },
  { id: 'w1', lane: 2, customer: 'Willems', projectId: '2140', description: 'Wallpaper repair', instruction: 'Repair damaged corner', hours: '3.5 h', remaining: '0.5 h', date: '17 Jun 2026 - 18 Jun 2026', startTime: '09:30 AM', endTime: '12:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Markt 22, 6211 CK Maastricht', backoffice: 'https://projectselect.eu/instructions/view/willems-wallpaper', remarks: 'Small repair job', activities: ['Wallpaper'], resources: ['threeE'], contact: 'Sjoerd' },
  { id: 's1', lane: 2, customer: 'Smit', projectId: '2255', description: 'Measure floor', instruction: 'Measure upstairs rooms', hours: '2.0 h', remaining: '0.5 h', date: '17 Jun 2026 - 17 Jun 2026', startTime: '02:00 PM', endTime: '04:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Grote Markt 1, 9712 HN Groningen', backoffice: 'https://projectselect.eu/instructions/view/smit-measure', remarks: 'Customer available after lunch', activities: ['Measuring'], resources: ['karel', 'kitty'], contact: 'Kitty Stoop' },
  { id: 'a2a', lane: 2, customer: 'Bos', projectId: '2310', description: 'Parquet sanding', instruction: 'Sand and re-lacquer hardwood', hours: '8.0 h', remaining: '4.0 h', date: '17 Jun 2026 - 18 Jun 2026', startTime: '07:00 AM', endTime: '03:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Gedempte Zuiderdiep 10, 9711 HB Groningen', backoffice: 'https://projectselect.eu/instructions/view/bos-parquet', remarks: 'Dust sheeting required', activities: ['Upholstery'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 'a2b', lane: 2, customer: 'Kok', projectId: '2368', description: 'Roller blind install', instruction: 'Blackout blinds in 3 rooms', hours: '4.0 h', remaining: '1.5 h', date: '17 Jun 2026 - 17 Jun 2026', startTime: '10:00 AM', endTime: '02:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Vismarkt 20, 9711 KP Groningen', backoffice: 'https://projectselect.eu/instructions/view/kok-blinds', remarks: 'Confirm bracket type', activities: ['Curtains'], resources: ['arjan'], contact: 'Arjan' },
  { id: 'a2c', lane: 2, customer: 'Vos', projectId: '2425', description: 'Painting bathroom', instruction: 'Moisture-resistant paint', hours: '5.0 h', remaining: '2.0 h', date: '17 Jun 2026 - 17 Jun 2026', startTime: '08:00 AM', endTime: '01:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Oosterstraat 33, 9711 NR Groningen', backoffice: 'https://projectselect.eu/instructions/view/vos-painting', remarks: 'Ventilation needed after', activities: ['Painting'], resources: ['kitty', 'karel'], contact: 'Karel Breed' },
  { id: 'a2d', lane: 2, customer: 'Kuiper', projectId: '2488', description: 'Kitchen assembly', instruction: 'Flat-pack kitchen cabinets', hours: '9.0 h', remaining: '3.5 h', date: '17 Jun 2026 - 18 Jun 2026', startTime: '07:30 AM', endTime: '04:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Peperstraat 2, 9712 HJ Groningen', backoffice: 'https://projectselect.eu/instructions/view/kuiper-kitchen', remarks: 'IKEA kitchen, parts on site', activities: ['Assembly'], resources: ['threeE', 'arjan', 'kitty'], contact: 'Roberto' },
  { id: 'a2e', lane: 2, customer: 'Jacobs', projectId: '2555', description: 'Electrical panel check', instruction: 'Inspect fuse box capacity', hours: '2.5 h', remaining: '0.5 h', date: '17 Jun 2026 - 17 Jun 2026', startTime: '03:00 PM', endTime: '05:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Nieuwe Boteringestraat 60, 9712 PL Groningen', backoffice: 'https://projectselect.eu/instructions/view/jacobs-panel', remarks: 'Report required', activities: ['Electrical'], resources: ['karel'], contact: 'Karel Breed' },
  { id: 'a2f', lane: 2, customer: 'Mulder', projectId: '2610', description: 'Wallpaper feature wall', instruction: 'Geometric pattern, living room', hours: '5.5 h', remaining: '2.0 h', date: '17 Jun 2026 - 18 Jun 2026', startTime: '09:30 AM', endTime: '03:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Aweg 47, 9718 CH Groningen', backoffice: 'https://projectselect.eu/instructions/view/mulder-wallpaper', remarks: 'Pattern repeat 64cm', activities: ['Wallpaper'], resources: ['arjan', 'kitty'], contact: 'Kitty Stoop' },

  { id: 'st1', lane: 3, customer: 'Stammis', projectId: '2380', description: 'Place curtains + jalousie', instruction: 'Use customer note', hours: '2.5 h', remaining: '0.5 h', date: '18 Jun 2026 - 18 Jun 2026', startTime: '08:15 AM', endTime: '11:00 AM', week: 'W25 - W25', status: 'Execution', location: 'Zijlstraat 56, 2011 TP Haarlem', backoffice: 'https://projectselect.eu/instructions/view/stammis-curtains', remarks: 'Workshop delivery', activities: ['Curtains'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 'm1', lane: 3, customer: 'Marisa-Hassing', projectId: '2468', description: 'Assembly work', instruction: 'Confirm parts before arrival', hours: '2.0 h', remaining: '1.0 h', date: '18 Jun 2026 - 18 Jun 2026', startTime: '08:15 AM', endTime: '11:00 AM', week: 'W25 - W25', status: 'Planning', location: 'Vughterstraat 89, 5211 GA Den Bosch', backoffice: 'https://projectselect.eu/instructions/view/marisa-assembly', remarks: 'Morning appointment', activities: ['Assembly'], resources: ['arjan'], contact: 'Arjan' },
  { id: 'g1', lane: 3, customer: 'Groen', projectId: '2509', description: 'PVC stairs finish', instruction: 'Finish stair edges', hours: '6.0 h', remaining: '2.5 h', date: '18 Jun 2026 - 19 Jun 2026', startTime: '12:00 PM', endTime: '05:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Stationsweg 18, 2312 AV Leiden', backoffice: 'https://projectselect.eu/instructions/view/groen-stairs', remarks: 'Use black profiles', activities: ['Upholstery'], resources: ['karel', 'kitty'], contact: 'Mrs. Penninga' },
  { id: 'l1', lane: 3, customer: 'Lammers', projectId: '2631', description: 'Painting touch-up', instruction: 'Touch up wall near window', hours: '3.0 h', remaining: '1.0 h', date: '18 Jun 2026 - 18 Jun 2026', startTime: '03:00 PM', endTime: '06:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Breestraat 100, 2311 CX Leiden', backoffice: 'https://projectselect.eu/instructions/view/lammers-painting', remarks: 'Paint already ordered', activities: ['Painting'], resources: ['threeE'], contact: 'Roberto' },
  { id: 'a3a', lane: 3, customer: 'Berg', projectId: '2680', description: 'Laminate floor', instruction: 'Install laminate in office', hours: '6.0 h', remaining: '2.0 h', date: '18 Jun 2026 - 18 Jun 2026', startTime: '07:00 AM', endTime: '01:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Rapenburg 10, 2311 EW Leiden', backoffice: 'https://projectselect.eu/instructions/view/berg-laminate', remarks: 'Underlay in van', activities: ['Upholstery'], resources: ['arjan', 'threeE'], contact: 'Arjan' },
  { id: 'a3b', lane: 3, customer: 'Janssen', projectId: '2735', description: 'Measure conservatory', instruction: 'Measure for plantation shutters', hours: '2.0 h', remaining: '0.5 h', date: '18 Jun 2026 - 18 Jun 2026', startTime: '09:00 AM', endTime: '11:00 AM', week: 'W25 - W25', status: 'Planning', location: 'Haarlemmerstraat 82, 2312 GK Leiden', backoffice: 'https://projectselect.eu/instructions/view/janssen-measure', remarks: 'Quote to follow', activities: ['Measuring'], resources: ['kitty'], contact: 'Kitty Stoop' },
  { id: 'a3c', lane: 3, customer: 'De Vries', projectId: '2790', description: 'Shutter installation', instruction: 'Install external shutters', hours: '7.0 h', remaining: '3.0 h', date: '18 Jun 2026 - 19 Jun 2026', startTime: '08:00 AM', endTime: '03:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Kaiserstraat 15, 2311 GN Leiden', backoffice: 'https://projectselect.eu/instructions/view/devries-shutters', remarks: 'Scaffolding pre-arranged', activities: ['Assembly', 'Curtains'], resources: ['arjan', 'karel', 'kitty'], contact: 'Karel Breed' },
  { id: 'a3d', lane: 3, customer: 'Muijs', projectId: '2848', description: 'Wallpaper hallway', instruction: 'Vertical stripe pattern', hours: '4.5 h', remaining: '1.5 h', date: '18 Jun 2026 - 18 Jun 2026', startTime: '01:00 PM', endTime: '05:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Lange Mare 38, 2312 GW Leiden', backoffice: 'https://projectselect.eu/instructions/view/muijs-wallpaper', remarks: 'Extra paste in stock', activities: ['Wallpaper'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 'a3e', lane: 3, customer: 'Hendriks-Wolff', projectId: '2905', description: 'Bathroom renovation', instruction: 'Tile adhesive and grouting', hours: '8.0 h', remaining: '3.5 h', date: '18 Jun 2026 - 19 Jun 2026', startTime: '07:30 AM', endTime: '03:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Witte Singel 22, 2311 BN Leiden', backoffice: 'https://projectselect.eu/instructions/view/hendrikswolff-bathroom', remarks: 'Grout colour: ivory', activities: ['Assembly'], resources: ['karel', 'kitty'], contact: 'Mrs. Penninga' },
  { id: 'a3f', lane: 3, customer: 'Broek', projectId: '2962', description: 'Electrical sockets', instruction: 'Install 6 new power points', hours: '3.5 h', remaining: '1.0 h', date: '18 Jun 2026 - 18 Jun 2026', startTime: '05:00 PM', endTime: '08:30 PM', week: 'W25 - W25', status: 'Planning', location: 'Steenschuur 5, 2311 ES Leiden', backoffice: 'https://projectselect.eu/instructions/view/broek-electrical', remarks: 'Evening appointment', activities: ['Electrical'], resources: ['threeE'], contact: 'Roberto' },

  { id: 'sch2', lane: 4, customer: 'Schrauwen', projectId: '2786', description: 'Wallpapering', instruction: 'Responsible: Sjoerd', hours: '8.0 h', remaining: '3.0 h', date: '19 Jun 2026 - 19 Jun 2026', startTime: '08:00 AM', endTime: '05:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Coolsingel 40, 3011 AD Rotterdam', backoffice: 'https://projectselect.eu/instructions/view/schrauwen-friday', remarks: 'Check final wall', activities: ['Wallpaper'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 't1', lane: 4, customer: 'Teunissen', projectId: '2844', description: 'Curtain rail install', instruction: 'Install rails in bedroom', hours: '4.0 h', remaining: '1.5 h', date: '19 Jun 2026 - 19 Jun 2026', startTime: '09:00 AM', endTime: '01:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Neude 11, 3512 AE Utrecht', backoffice: 'https://projectselect.eu/instructions/view/teunissen-rail', remarks: 'Bring long ladder', activities: ['Curtains'], resources: ['arjan', 'karel'], contact: 'Arjan' },
  { id: 'z1', lane: 4, customer: 'Zandbergen', projectId: '2991', description: 'Floor inspection', instruction: 'Inspect subfloor humidity', hours: '2.0 h', remaining: '0.5 h', date: '19 Jun 2026 - 19 Jun 2026', startTime: '02:00 PM', endTime: '04:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Damrak 70, 1012 LM Amsterdam', backoffice: 'https://projectselect.eu/instructions/view/zandbergen-inspection', remarks: 'Send report afterwards', activities: ['Measuring'], resources: ['threeE', 'kitty'], contact: 'Kitty Stoop' },
  { id: 'e1', lane: 4, customer: 'Elshof', projectId: '3065', description: 'Electrical check', instruction: 'Check dimmer compatibility', hours: '3.5 h', remaining: '1.0 h', date: '19 Jun 2026 - 20 Jun 2026', startTime: '04:15 PM', endTime: '06:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Kerkstraat 3, 6811 DL Arnhem', backoffice: 'https://projectselect.eu/instructions/view/elshof-electrical', remarks: 'Customer requested evening slot', activities: ['Electrical'], resources: ['karel'], contact: 'Karel Breed' },
  { id: 'a4a', lane: 4, customer: 'Van Rijn', projectId: '3120', description: 'PVC floor living room', instruction: 'Move furniture before start', hours: '6.0 h', remaining: '2.0 h', date: '19 Jun 2026 - 19 Jun 2026', startTime: '08:00 AM', endTime: '02:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Koningstraat 10, 6811 DH Arnhem', backoffice: 'https://projectselect.eu/instructions/view/vanrijn-pvc', remarks: 'Furniture removal included', activities: ['Upholstery', 'Measuring'], resources: ['threeE', 'arjan'], contact: 'Sjoerd' },
  { id: 'a4b', lane: 4, customer: 'Stam', projectId: '3178', description: 'Curtain supply & hang', instruction: 'Eyelet curtains, double track', hours: '5.0 h', remaining: '2.0 h', date: '19 Jun 2026 - 19 Jun 2026', startTime: '09:00 AM', endTime: '02:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Jansplaats 30, 6811 GK Arnhem', backoffice: 'https://projectselect.eu/instructions/view/stam-curtains', remarks: 'Customer keeps old tracks', activities: ['Curtains'], resources: ['kitty', 'arjan'], contact: 'Kitty Stoop' },
  { id: 'a4c', lane: 4, customer: 'Wolters', projectId: '3235', description: 'Wall painting dining', instruction: 'Wainscoting effect', hours: '7.0 h', remaining: '3.0 h', date: '19 Jun 2026 - 20 Jun 2026', startTime: '07:30 AM', endTime: '02:30 PM', week: 'W25 - W25', status: 'Execution', location: 'Bakkerstraat 8, 6811 EM Arnhem', backoffice: 'https://projectselect.eu/instructions/view/wolters-painting', remarks: 'Two colours requested', activities: ['Painting'], resources: ['threeE', 'kitty'], contact: 'Roberto' },
  { id: 'a4d', lane: 4, customer: 'Boer', projectId: '3290', description: 'Wallpaper study', instruction: 'Linen texture wallpaper', hours: '4.0 h', remaining: '1.5 h', date: '19 Jun 2026 - 19 Jun 2026', startTime: '01:00 PM', endTime: '05:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Velperweg 55, 6824 HH Arnhem', backoffice: 'https://projectselect.eu/instructions/view/boer-wallpaper', remarks: 'Single roll left over from order', activities: ['Wallpaper'], resources: ['arjan'], contact: 'Arjan' },
  { id: 'a4e', lane: 4, customer: 'Peeters', projectId: '3352', description: 'Wardrobe assembly', instruction: 'Built-in wardrobe system', hours: '8.0 h', remaining: '3.5 h', date: '19 Jun 2026 - 20 Jun 2026', startTime: '08:00 AM', endTime: '04:00 PM', week: 'W25 - W25', status: 'Execution', location: 'Parkstraat 14, 6828 AC Arnhem', backoffice: 'https://projectselect.eu/instructions/view/peeters-wardrobe', remarks: 'Sliding doors in storage', activities: ['Assembly'], resources: ['arjan', 'karel', 'kitty'], contact: 'Karel Breed' },
  { id: 'a4f', lane: 4, customer: 'Willems-Kort', projectId: '3410', description: 'Socket relocation', instruction: 'Move TV point to opposite wall', hours: '3.0 h', remaining: '1.0 h', date: '19 Jun 2026 - 19 Jun 2026', startTime: '05:00 PM', endTime: '08:00 PM', week: 'W25 - W25', status: 'Planning', location: 'Rosendaalsestraat 100, 6824 AA Arnhem', backoffice: 'https://projectselect.eu/instructions/view/willemskort-socket', remarks: 'Chase wall if needed', activities: ['Electrical'], resources: ['karel'], contact: 'Karel Breed' },
];

const activities = ['Upholstery', 'Measuring', 'Wallpaper', 'Curtains', 'Assembly', 'Painting', 'Electrical'];
const contacts = ['Karel Breed', 'Mrs. Penninga', 'Sjoerd', 'Roberto', 'Arjan', 'Kitty Stoop'];
const weeks = [23, 24, 25, 26, 27, 28];


const defaultVisibleFields = [
  'remarks', 'projectStatus', 'startDate', 'relation', 'planningStatus', 'projectAddress', 'workDescription', 'executionType', 'workType', 'hours', 'remaining', 'resources'
];

const fieldDefinitions = [
  { key: 'color', label: 'Color', get: () => '' },
  { key: 'remarks', label: 'Opmerkingen', get: c => c.remarks || c.instruction || c.description },
  { key: 'projectStatus', label: 'Project status', get: c => c.status === 'Execution' ? 'Uitvoering' : c.status },
  { key: 'startDate', label: 'Start datum', get: c => `${firstDate(c.date)} ${c.startTime}` },
  { key: 'relation', label: 'Relatie', get: c => `${c.customer} ${c.projectId}` },
  { key: 'planningStatus', label: 'Status planning', get: c => c.status === 'Execution' ? 'Gepland' : c.status },
  { key: 'projectAddress', label: 'Project adres', get: c => c.location || 'Middenweg 522' },
  { key: 'workDescription', label: 'Werk omschrijving', get: c => c.description },
  { key: 'executionType', label: 'Uitvoeringstype', get: c => c.activities?.[0] || 'Service' },
  { key: 'workType', label: 'Werk type', get: c => c.activities?.join(', ') || 'Planning' },
  { key: 'deliveryDate', label: 'Leverdatum', get: c => lastDate(c.date) },
  { key: 'file', label: 'File', get: c => c.backoffice ? 'Instruction linked' : '' },
  { key: 'resources', label: 'Resources', get: c => c.resources.map(id => people[id]?.name || id).join(', ') },
  { key: 'hours', label: 'uren2', get: c => c.hours },
  { key: 'remaining', label: 'Resterend', get: c => c.remaining },
  { key: 'personDays', label: 'pers/dagen', get: c => `${c.resources.length} / ${c.week}` },
  { key: 'receiptStatus', label: 'Status Ontvangst', get: c => c.status === 'Execution' ? 'Akkoord' : 'Voorlopig' },
  { key: 'location', label: 'Locatie', get: c => c.location },
  { key: 'customerContact', label: 'Customer contact', get: c => c.contact || 'Karel Breed' },
  { key: 'instructions', label: 'Instructions', get: c => c.instruction || 'Open instruction' },
];

function getField(key) { return fieldDefinitions.find(field => field.key === key); }

function isoWeekStart(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const day = simple.getDay() || 7;
  const monday = new Date(simple);
  if (day <= 4) monday.setDate(simple.getDate() - day + 1);
  else monday.setDate(simple.getDate() + 8 - day);
  return monday;
}
function formatShort(date) { return date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }); }
function firstDate(dateText) { return (dateText || '').split(' - ')[0].trim(); }
function lastDate(dateText) { const parts = (dateText || '').split(' - '); return (parts[1] || parts[0] || '').trim(); }
function toDateInput(dateText, timeText, useEnd = false) {
  const first = useEnd ? lastDate(dateText) : firstDate(dateText); const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
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
    <p className="card-subtitle">Planning for kitchen installation and site preparation.</p>
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
    setForm({ ...card, startDateTime: toDateInput(card.date, card.startTime), endDateTime: toDateInput(card.date, card.endTime, true) });
  }, [card]);
  if (!card || !form) return null;
  const save = () => {
    const start = fromDateInput(form.startDateTime); const end = fromDateInput(form.endDateTime);
    onSave({ ...card, description: form.description, date: start.date && end.date ? `${start.date} - ${end.date}` : (start.date || card.date), startTime: start.time || card.startTime, endTime: end.time || card.endTime, resources: form.resources, activities: form.activities, location: form.location, contact: form.contact, remarks: form.remarks });
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
            <div className="field-row location-row"><label>Location</label><div className="location-input-wrap"><input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} /><a className="map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.location || '')}`} target="_blank" rel="noopener" title="Open in Google Maps">📍</a></div></div>
            <div className="field-row"><label>Instructions</label><a className="readonly-link" href={form.backoffice || '#'} target="_blank" rel="noopener">{form.instruction || form.backoffice || 'Open instruction'}</a></div>
          </div></section>
          <section className="modal-section-card"><h4>Remarks</h4><div className="field-list"><div className="field-row"><label>Remarks</label><textarea rows="4" value={form.remarks || ''} onChange={e => setForm({ ...form, remarks: e.target.value })} /></div></div></section>
        </div></div>
      </div>
      <div className="modal-actions house-actions"><button className="modal-btn" type="button" onClick={onClose}>Close</button><button className="modal-btn primary" type="button" onClick={save}>Save changes</button></div>
    </div>
  </div>;
}

function ViewToggle({ activeView, onChange }) {
  return <div className="view-toggle" role="group" aria-label="Planning view switcher">
    <button type="button" className={activeView === 'table' ? 'active' : ''} onClick={() => onChange('table')}>Table View</button>
    <button type="button" className={activeView === 'card' ? 'active' : ''} onClick={() => onChange('card')}>Card View</button>
  </div>;
}

function TableStatusBadge({ value }) {
  const normalized = String(value || '').toLowerCase();
  const className = normalized.includes('akkoord') || normalized.includes('gepland') ? 'green' : normalized.includes('uitvoering') ? 'teal' : normalized.includes('created') ? 'grey' : normalized.includes('afgerond') ? 'darkgrey' : 'purple';
  return <span className={`table-status ${className}`}>{value}</span>;
}

function FieldSelectionModal({ visibleFields, onClose, onSave, onReset }) {
  const [draftVisible, setDraftVisible] = useState(visibleFields);
  const [leftQuery, setLeftQuery] = useState('');
  const [rightQuery, setRightQuery] = useState('');
  const [dragField, setDragField] = useState(null);
  const available = fieldDefinitions.filter(field => !draftVisible.includes(field.key) && field.label.toLowerCase().includes(leftQuery.toLowerCase()));
  const selected = draftVisible.map(getField).filter(Boolean).filter(field => field.label.toLowerCase().includes(rightQuery.toLowerCase()));

  const addField = key => setDraftVisible(current => current.includes(key) ? current : [...current, key]);
  const removeField = key => setDraftVisible(current => current.filter(item => item !== key));
  const moveField = (key, targetKey) => {
    setDraftVisible(current => {
      const without = current.filter(item => item !== key);
      const targetIndex = without.indexOf(targetKey);
      if (targetIndex < 0) return [...without, key];
      return [...without.slice(0, targetIndex), key, ...without.slice(targetIndex)];
    });
  };

  const onDropSelected = targetKey => {
    if (!dragField) return;
    if (!draftVisible.includes(dragField)) addField(dragField);
    if (targetKey && dragField !== targetKey) moveField(dragField, targetKey);
    setDragField(null);
  };

  return <div className="fields-modal-backdrop" onClick={onClose}>
    <div className="fields-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
      <div className="fields-modal-head">
        <h2>Selecteer te tonen velden</h2>
        <button type="button" className="fields-close" onClick={onClose}>×</button>
      </div>
      <div className="fields-columns">
        <section className="fields-panel" onDragOver={e => e.preventDefault()} onDrop={() => { if (dragField) { removeField(dragField); setDragField(null); } }}>
          <h3>Lijst van beschikbare velden</h3>
          <input className="field-search" placeholder="Zoek beschikbare velden" value={leftQuery} onChange={e => setLeftQuery(e.target.value)} />
          <div className="field-list-box">
            {available.map(field => <div className="field-option" draggable key={field.key} onDragStart={() => setDragField(field.key)} onDoubleClick={() => addField(field.key)}>
              <span className="field-dot" />{field.label}
            </div>)}
          </div>
        </section>
        <section className="fields-panel selected" onDragOver={e => e.preventDefault()} onDrop={() => onDropSelected(null)}>
          <h3>Selecteer velden</h3>
          <input className="field-search" placeholder="Zoek geselecteerde velden" value={rightQuery} onChange={e => setRightQuery(e.target.value)} />
          <div className="field-list-box">
            {selected.map((field, index) => <div className="field-option selected-field" draggable key={field.key} onDragStart={() => setDragField(field.key)} onDragOver={e => e.preventDefault()} onDrop={(e) => { e.stopPropagation(); onDropSelected(field.key); }} onDoubleClick={() => removeField(field.key)}>
              <span className="sort-handle">☰</span>{field.label}{index === 2 && <span className="sort-active">↓</span>}
            </div>)}
          </div>
        </section>
      </div>
      <p className="field-note">Click ● om te sorteren ↑↓</p>
      <div className="fields-modal-actions">
        <button type="button" className="modal-btn" onClick={() => setDraftVisible(defaultVisibleFields)}>Herstel</button>
        <button type="button" className="modal-btn primary" onClick={() => onSave(draftVisible)}>Opslaan</button>
      </div>
    </div>
  </div>;
}

function TableView({ cards, query, setQuery, visibleFields, setVisibleFields, activeView, setActiveView }) {
  const tableWrapRef = useRef(null);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const filteredCards = cards.filter(c => (c.customer + ' ' + c.projectId + ' ' + c.description + ' ' + c.location + ' ' + c.activities.join(' ')).toLowerCase().includes(query.toLowerCase()));
  const scrollBy = amount => tableWrapRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  return <section className="table-overview-card">
    <div className="table-overview-head">
      <h2>Tabel Planning Overzicht</h2>
      <div className="table-head-actions">
        <ViewToggle activeView={activeView} onChange={setActiveView} />
        <select className="period-select"><option>04 &lt; Last 1 month</option><option>03 &lt; Last 2 months</option><option>02 &lt; Current quarter</option></select>
        <button className="icon-btn" type="button" title="Settings">⚙</button>
        <button className="icon-btn filled" type="button" title="Refresh">↔</button>
        <button className="export-btn" type="button">Exporteren <span>⇩</span><span>⌄</span></button>
      </div>
    </div>
    <div className="table-toolbar">
      <button className="zoom-btn" type="button">100%</button>
      <span className="rows-info">Aantal rijen per pagina, totaal {filteredCards.length}</span>
      <div className="table-toolbar-right">
        <div className="scroll-actions">
          <button className="scroll-btn" type="button" onClick={() => scrollBy(-360)}>‹ Scroll left</button>
          <button className="scroll-btn" type="button" onClick={() => scrollBy(360)}>Scroll right ›</button>
        </div>
        <button className="toon-velden-btn" type="button" onClick={() => setShowFieldsModal(true)}>Toon velden</button>
        <div className="table-search">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Zoeken in planning" />
          <button type="button" aria-label="Search">⌕</button>
        </div>
      </div>
    </div>
    <div className="planning-table-wrap" ref={tableWrapRef}>
      <table className="planning-table">
        <thead>
          <tr><th className="check-col"><input type="checkbox" /></th>{visibleFields.map(key => <th key={key}>{getField(key)?.label || key}{key === 'startDate' && <span className="sort-arrow">↓</span>}</th>)}</tr>
          <tr className="filter-row"><td></td>{visibleFields.map(key => <td key={key}><input placeholder={key === 'startDate' ? '< Date now - Last month' : ''} /><span className="cell-search">⌕</span></td>)}</tr>
        </thead>
        <tbody>
          {filteredCards.map((card, rowIndex) => <tr key={card.id} className={rowIndex % 2 ? 'alt' : ''}>
            <td><input type="checkbox" /></td>
            {visibleFields.map(key => {
              const field = getField(key);
              const value = field?.get(card) || '';
              if (key === 'projectStatus' || key === 'planningStatus' || key === 'receiptStatus') return <td key={key}><TableStatusBadge value={value} /></td>;
              if (key === 'executionType' || key === 'workType') return <td key={key}>{String(value).split(', ').map(tag => <span className="type-tag" key={tag}>{tag}</span>)}</td>;
              if (key === 'color') return <td key={key}><span className="color-dot" /></td>;
              return <td key={key}>{value}</td>;
            })}
          </tr>)}
        </tbody>
      </table>
    </div>
    {showFieldsModal && <FieldSelectionModal visibleFields={visibleFields} onClose={() => setShowFieldsModal(false)} onSave={(fields) => { setVisibleFields(fields); setShowFieldsModal(false); }} onReset={() => setVisibleFields(defaultVisibleFields)} />}
  </section>;
}

function CardBoardView({ cards, shown, dates, week, setWeek, query, setQuery, draggedId, setDraggedId, setCards, setActiveId }) {
  return <>
    <section className="date-board-wrap"><div className="date-board">{dates.map((d, i) => { const laneCards = shown.filter(c => c.lane === i); return <div className={`date-lane ${i === 2 ? 'today' : ''}`} key={i} onDragOver={e => e.preventDefault()} onDrop={() => { if (draggedId) { setCards(cs => cs.map(c => c.id === draggedId ? { ...c, lane: i, muted: false } : c)); setDraggedId(null); } }}><div className="date-head"><span>{formatShort(d)}</span>{i === 2 && <strong>Today</strong>}<em>{laneCards.length}</em></div>{laneCards.map(card => <Card key={card.id} card={card} onOpen={setActiveId} onDragStart={setDraggedId} />)}</div>; })}</div></section>
  </>;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('table');
  const [week, setWeek] = useState(25);
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState(initialCards);
  const [visibleFields, setVisibleFields] = useState(defaultVisibleFields);
  const [draggedId, setDraggedId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const dates = useMemo(() => { const monday = isoWeekStart(week, 2026); return Array.from({ length: 5 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; }); }, [week]);
  const shown = cards.filter(c => (c.customer + ' ' + c.projectId + ' ' + c.description + ' ' + c.activities.join(' ')).toLowerCase().includes(query.toLowerCase()));
  const activeCard = cards.find(c => c.id === activeId);
  if (!loggedIn) return <section className="login-page"><div className="login-card"><Brand /><h1>Portal Login</h1><p>Sign in to continue to Related Planning Data.</p><label>Username</label><input placeholder="Enter username" /><label>Password</label><input type="password" placeholder="Enter password" onKeyDown={e => e.key === 'Enter' && setLoggedIn(true)} /><button onClick={() => setLoggedIn(true)}>Login</button><small>No credentials needed for this prototype.</small></div></section>;
  return <div className="app-shell">
    <header className="portal-header"><Brand /><nav className="portal-nav"><a href="#">CUSTOMERS <span>⌄</span></a><a href="#">PROJECTS <span>⌄</span></a><a href="#">PLANNING LINES</a><a href="#">SALES <span>⌄</span></a><a href="#">PURCHASE <span>⌄</span></a><a href="#">MESSAGE VIEW</a><a href="#">TABLES <span>⌄</span></a><a href="#">SYSTEM <span>⌄</span></a></nav><div className="user-area"><span>Hello <b>Karel 2</b></span><img src="https://i.pravatar.cc/80?img=12" alt="Karel" /></div></header>
    <main className="related-page">
      {activeView === 'card' && <section className="related-toolbar">
        <div className="toolbar-title"><h1>Related Planning Data</h1><p>All project planning lines are listed here. Drag cards between date columns.</p></div>
        <div className="toolbar-actions">
          <ViewToggle activeView={activeView} onChange={setActiveView} />
          <div className="week-control"><button className="nav-round" onClick={() => setWeek(w => Math.max(1, w - 1))}>‹</button><span className="week-badge">W{week}</span><select value={week} onChange={e => setWeek(Number(e.target.value))}>{weeks.map(w => <option key={w} value={w}>W{w}</option>)}</select><strong>{formatShort(dates[0])} - {formatShort(dates[4])} 2026</strong><button className="nav-round" onClick={() => setWeek(w => Math.min(53, w + 1))}>›</button></div>
          <div className="toolbar-search"><input placeholder="Search related data" value={query} onChange={e => setQuery(e.target.value)} /></div>
        </div>
      </section>}
      {activeView === 'table'
        ? <TableView cards={cards} query={query} setQuery={setQuery} visibleFields={visibleFields} setVisibleFields={setVisibleFields} activeView={activeView} setActiveView={setActiveView} />
        : <CardBoardView cards={cards} shown={shown} dates={dates} week={week} setWeek={setWeek} query={query} setQuery={setQuery} draggedId={draggedId} setDraggedId={setDraggedId} setCards={setCards} setActiveId={setActiveId} />}
    </main>
    <DetailModal card={activeCard} onClose={() => setActiveId(null)} onSave={(updated) => { setCards(cs => cs.map(c => c.id === updated.id ? updated : c)); setActiveId(null); }} />
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
