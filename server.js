const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

const VD = '9 Sep 2026'; // verified date shorthand

const DEFAULT_LINKS = [
  // ---- Identity Documents ----
  { id: 1, category: 'identity', name: 'Update Aadhaar address or details', description: 'Change address, mobile number, or correct details on your Aadhaar card.', url: 'https://uidai.gov.in', verified_date: VD },
  { id: 2, category: 'identity', name: 'Download or reprint e-Aadhaar', description: 'Get a digital copy of your Aadhaar card.', url: 'https://uidai.gov.in', verified_date: VD },
  { id: 3, category: 'identity', name: 'Apply for a new PAN card', description: 'New PAN application through the official Income Tax portal.', url: 'https://www.incometax.gov.in', verified_date: VD },
  { id: 4, category: 'identity', name: 'Link PAN with Aadhaar', description: 'Mandatory linking to keep your PAN active.', url: 'https://www.incometax.gov.in', verified_date: VD },
  { id: 5, category: 'identity', name: 'Register or update Voter ID', description: 'New voter registration, address change, or correction via the Election Commission.', url: 'https://www.nvsp.in', verified_date: VD },
  { id: 6, category: 'identity', name: 'Apply for or renew Driving Licence', description: "Learner's licence, permanent DL, or renewal through Parivahan Sewa.", url: 'https://parivahan.gov.in', verified_date: VD },
  { id: 7, category: 'identity', name: 'Vehicle registration (RC)', description: 'Register a new vehicle or transfer ownership.', url: 'https://parivahan.gov.in', verified_date: VD },
  { id: 8, category: 'identity', name: 'Apply for Passport', description: 'New passport, renewal, or Tatkaal appointment booking.', url: 'https://www.passportindia.gov.in', verified_date: VD },
  { id: 9, category: 'identity', name: 'DigiLocker — store official documents', description: 'Government-issued digital locker for Aadhaar, DL, marksheets, and more.', url: 'https://www.digilocker.gov.in', verified_date: VD },
  { id: 10, category: 'identity', name: 'Birth or Death Certificate', description: 'Apply for or download a civil registration certificate.', url: 'https://crsorgi.gov.in', verified_date: VD },

  // ---- Exams & Admissions ----
  { id: 11, category: 'exams', name: 'SSC — Staff Selection Commission exams', description: 'CGL, CHSL, MTS and other central government job exam forms.', url: 'https://ssc.gov.in', verified_date: VD },
  { id: 12, category: 'exams', name: 'IBPS — Bank PO/Clerk exams', description: 'Recruitment for public sector bank posts.', url: 'https://www.ibps.in', verified_date: VD },
  { id: 13, category: 'exams', name: 'RRB — Railway recruitment exams', description: 'Group D, NTPC, and other railway job exam forms.', url: 'https://www.rrbcdg.gov.in', verified_date: VD },
  { id: 14, category: 'exams', name: 'UPSC — Civil services exams', description: 'IAS, IPS, NDA, CDS and other central civil/defence service exam applications.', url: 'https://upsc.gov.in', verified_date: VD },
  { id: 15, category: 'exams', name: 'NTA — NEET, JEE and university entrance exams', description: 'National-level entrance exam registration and admit cards.', url: 'https://www.nta.ac.in', verified_date: VD },
  { id: 16, category: 'exams', name: 'CBSE — Board exam results & services', description: 'Class 10/12 board exam registration, admit cards, and results.', url: 'https://www.cbse.gov.in', verified_date: VD },
  { id: 17, category: 'exams', name: 'UGC NET — Lectureship & JRF exam', description: 'National Eligibility Test for teaching and research posts.', url: 'https://ugcnet.nta.nic.in', verified_date: VD },

  // ---- Banking & Finance ----
  { id: 18, category: 'banking', name: 'SBI — State Bank of India net banking', description: "Official login for SBI's YONO and internet banking.", url: 'https://sbi.co.in', verified_date: VD },
  { id: 19, category: 'banking', name: 'RBI — Reserve Bank of India', description: 'Circulars, complaint portal, and official notices.', url: 'https://www.rbi.org.in', verified_date: VD },
  { id: 20, category: 'banking', name: 'EPFO — Provident Fund withdrawal & balance', description: 'Check PF balance, file a claim, or update KYC.', url: 'https://www.epfindia.gov.in', verified_date: VD },
  { id: 21, category: 'banking', name: 'GST Portal — Registration & filing', description: 'Goods and Services Tax registration, return filing, and payments.', url: 'https://www.gst.gov.in', verified_date: VD },
  { id: 22, category: 'banking', name: 'NPS — National Pension System', description: 'Open or manage a National Pension System account.', url: 'https://npscra.nsdl.co.in', verified_date: VD },
  { id: 23, category: 'banking', name: 'SEBI — Securities & Exchange Board', description: 'Investor complaints, circulars, and market regulation info.', url: 'https://www.sebi.gov.in', verified_date: VD },
  { id: 24, category: 'banking', name: 'India Post Payments Bank', description: 'Open or manage an IPPB account.', url: 'https://www.ippbonline.com', verified_date: VD },

  // ---- Welfare & Utilities ----
  { id: 25, category: 'welfare', name: 'MyGov — Citizen engagement platform', description: 'Government schemes, surveys, and citizen participation.', url: 'https://www.mygov.in', verified_date: VD },
  { id: 26, category: 'welfare', name: 'National Portal of India', description: 'Single-window access to information across government services.', url: 'https://www.india.gov.in', verified_date: VD },
  { id: 27, category: 'welfare', name: 'Ayushman Bharat (PM-JAY) — Health insurance', description: 'Check eligibility and access India\'s national health insurance scheme.', url: 'https://pmjay.gov.in', verified_date: VD },
  { id: 28, category: 'welfare', name: 'PM-KISAN — Farmer income support', description: 'Check status and enroll for the farmer income support scheme.', url: 'https://pmkisan.gov.in', verified_date: VD },
  { id: 29, category: 'welfare', name: 'e-Shram — Unorganised worker registration', description: 'Register for the national database of unorganised sector workers.', url: 'https://eshram.gov.in', verified_date: VD },
  { id: 30, category: 'welfare', name: 'CoWIN — Vaccination certificate', description: 'Download COVID-19 vaccination certificates and records.', url: 'https://www.cowin.gov.in', verified_date: VD },

  // ---- Education ----
  { id: 31, category: 'education', name: 'National Scholarship Portal', description: 'Apply for central and state government scholarships.', url: 'https://scholarships.gov.in', verified_date: VD },
  { id: 32, category: 'education', name: 'SWAYAM — Free online courses', description: 'Government-backed free online courses and certifications.', url: 'https://swayam.gov.in', verified_date: VD },
  { id: 33, category: 'education', name: 'UGC — University Grants Commission', description: 'University recognition, notices, and higher education regulation.', url: 'https://www.ugc.gov.in', verified_date: VD },
  { id: 34, category: 'education', name: 'AICTE — Technical education approval', description: 'Approval status and notices for technical/engineering colleges.', url: 'https://www.aicte-india.org', verified_date: VD },
];

function loadData() {
  if (fs.existsSync(DATA_PATH)) {
    try {
      const raw = fs.readFileSync(DATA_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      // If the stored directory is from an older, smaller seed, refresh it
      // while keeping any reports the user already submitted.
      if (!parsed.links || parsed.links.length < DEFAULT_LINKS.length) {
        parsed.links = DEFAULT_LINKS;
        saveData(parsed);
      }
      return parsed;
    } catch (err) {
      console.error('Could not parse data.json, reseeding:', err.message);
    }
  }
  const fresh = { links: DEFAULT_LINKS, reports: [], nextReportId: 1 };
  saveData(fresh);
  console.log(`Seeded ${DEFAULT_LINKS.length} links into data.json`);
  return fresh;
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

let db = loadData();

function sendJSON(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function serveStatic(req, res, urlPath) {
  let filePath = urlPath === '/' ? '/index.html' : urlPath;
  filePath = path.join(PUBLIC_DIR, filePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) req.destroy();
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  try {
    if (pathname === '/api/links' && req.method === 'GET') {
      const search = (parsedUrl.searchParams.get('search') || '').trim().toLowerCase();
      const category = (parsedUrl.searchParams.get('category') || 'all').trim().toLowerCase();
      let results = db.links;
      if (category !== 'all') results = results.filter(l => l.category === category);
      if (search) results = results.filter(l => l.name.toLowerCase().includes(search) || l.description.toLowerCase().includes(search));
      results = [...results].sort((a, b) => a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category));
      return sendJSON(res, 200, { count: results.length, links: results });
    }

    if (pathname === '/api/report' && req.method === 'POST') {
      const raw = await readBody(req);
      let body;
      try { body = JSON.parse(raw); } catch { return sendJSON(res, 400, { error: 'Invalid JSON body' }); }
      const site = (body.site || '').trim();
      const url = (body.url || '').trim();
      const details = (body.details || '').trim();
      if (!site) return sendJSON(res, 400, { error: 'Field "site" is required' });
      if (site.length > 200 || url.length > 500 || details.length > 2000) return sendJSON(res, 400, { error: 'One or more fields exceed the allowed length' });
      const report = {
        id: db.nextReportId++,
        site: escapeHtml(site),
        url: escapeHtml(url),
        details: escapeHtml(details),
        status: 'pending',
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      db.reports.unshift(report);
      saveData(db);
      return sendJSON(res, 201, { message: 'Report submitted successfully.', reportId: report.id });
    }

    if (pathname === '/api/reports' && req.method === 'GET') {
      return sendJSON(res, 200, { count: db.reports.length, reports: db.reports });
    }

    if (pathname === '/api/categories' && req.method === 'GET') {
      const counts = {};
      db.links.forEach(l => { counts[l.category] = (counts[l.category] || 0) + 1; });
      const categories = Object.keys(counts).map(category => ({ category, count: counts[category] }));
      return sendJSON(res, 200, { categories });
    }

    if (req.method === 'GET') return serveStatic(req, res, pathname);

    sendJSON(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('Server error:', err);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`GenuineWeb server running at http://localhost:${PORT}`);
});
