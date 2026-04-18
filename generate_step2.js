import fs from 'fs';
import path from 'path';

const services = [
  { id: 'ac-repair', name: 'AC Repair', desc: 'AC Repair and Troubleshooting' },
  { id: 'ac-service', name: 'AC Service', desc: 'AC Servicing and Cleaning' },
  { id: 'ac-installation', name: 'AC Installation', desc: 'AC Installation and Fitting' },
  { id: 'ac-amc', name: 'AC AMC', desc: 'AC Annual Maintenance Contract' }
];

const cities = [
  { id: 'delhi', name: 'Delhi' },
  { id: 'gurgaon', name: 'Gurgaon' },
  { id: 'noida', name: 'Noida' },
  { id: 'faridabad', name: 'Faridabad' }
];

const micromarkets = {
  delhi: 'Saket, Vasant Kunj, Vasant Vihar, Malviya Nagar, Hauz Khas, Greater Kailash, Defence Colony, Lajpat Nagar, Nehru Place, Kalkaji, Okhla, Dwarka, Janakpuri, Uttam Nagar, Vikaspuri, Punjabi Bagh, Paschim Vihar, Rohini, Pitampura, Shalimar Bagh, Model Town, Civil Lines, Laxmi Nagar, Mayur Vihar, Patparganj, Preet Vihar, Connaught Place, Karol Bagh',
  gurgaon: 'DLF Phase 1-5, Sushant Lok, South City, Palam Vihar, Nirvana Country, Malibu Towne, Sectors 4-47, Golf Course Road, Sectors 42-58, New Gurgaon, Sectors 67-95, Dwarka Expressway, Manesar, Udyog Vihar',
  noida: 'Sectors 12-66, Premium Sectors 76-137, Greater Noida, Knowledge Park, Alpha, Beta, Gamma, Delta, Omega, Omaxe City, Gaur City',
  faridabad: 'NIT, Sectors 7-46, Green Field Colony, Sainik Colony, Neharpar, Sectors 55-90, Ballabgarh, IMT Faridabad'
};

const template = (title, description, keywords, canonical, h1, lead, type, city, serviceName) => `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <link rel="canonical" href="https://aircontrols.in${canonical}">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
  <style>
    .dropdown { position: relative; display: inline-block; }
    .dropdown-content { display: none; position: absolute; background-color: rgba(10,22,40,0.97); min-width: 160px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1; border-radius: 6px; }
    .dropdown-content a { color: rgba(255,255,255,.78); padding: 12px 16px; text-decoration: none; display: block; }
    .dropdown-content a:hover { background-color: rgba(200,168,75,.08); color: var(--gold); }
    .dropdown:hover .dropdown-content { display: block; }
    .breadcrumb { padding: 20px 48px; background: var(--navy-deep); color: var(--gray-l); font-size: 13px; margin-top: 72px; }
    .breadcrumb a { color: var(--gold); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .content-section { padding: 60px 48px; max-width: 1140px; margin: 0 auto; }
    .content-section h2 { font-family: 'Playfair Display', serif; font-size: 32px; color: var(--navy); margin-bottom: 24px; }
    .content-section p { color: var(--gray); line-height: 1.7; margin-bottom: 16px; }
    .grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px; margin-top: 32px; }
    .card-item { background: var(--white); border: 1px solid var(--border); border-radius: var(--r14); padding: 24px; transition: all 0.3s; }
    .card-item:hover { box-shadow: var(--shadow-soft); transform: translateY(-4px); }
    .card-item h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--navy); margin-bottom: 12px; }
    .card-item a { color: var(--royal); font-weight: 600; text-decoration: none; }
    .card-item a:hover { color: var(--gold); }
    .faq-item { margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
    .faq-item h3 { font-size: 18px; color: var(--navy); margin-bottom: 8px; }
    .faq-item p { color: var(--gray); font-size: 15px; }
  </style>
</head>
<body>
  <nav id="mainNav">
    <div class="nav-logo" onclick="window.location.href='/'">
      <svg class="nav-logo-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#1e4db7"/>
        <circle cx="20" cy="20" r="16" fill="#0a1628"/>
        <text x="20" y="15" text-anchor="middle" fill="#c8a84b" font-size="6" font-family="Georgia,serif" font-weight="bold" letter-spacing="0.5">AIR</text>
        <text x="20" y="23" text-anchor="middle" fill="#ffffff" font-size="8" font-family="Georgia,serif" font-weight="bold">CONTROL</text>
        <path d="M10 27 Q20 32 30 27" stroke="#c8a84b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      </svg>
      <div>
        <div class="nav-brand-name">Air Control</div>
        <div class="nav-brand-sub">38 Years of Excellence</div>
      </div>
    </div>
    <ul class="nav-links-list">
      <li><a href="/">Home</a></li>
      <li class="dropdown">
        <a href="/#services">Services ▾</a>
        <div class="dropdown-content">
          <a href="/services/ac-repair/">AC Repair</a>
          <a href="/services/ac-service/">AC Service</a>
          <a href="/services/ac-installation/">AC Installation</a>
          <a href="/services/ac-amc/">AC AMC</a>
        </div>
      </li>
      <li class="dropdown">
        <a href="/#locations">Locations ▾</a>
        <div class="dropdown-content">
          <a href="/locations/delhi/">Delhi</a>
          <a href="/locations/gurgaon/">Gurgaon</a>
          <a href="/locations/noida/">Noida</a>
          <a href="/locations/faridabad/">Faridabad</a>
        </div>
      </li>
      <li><a href="/#why">Why Air Control</a></li>
      <li><a href="/#industries">Industries</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
    <a href="tel:+919312264832" class="nav-cta-btn" style="text-decoration:none;">📞 Consult Expert</a>
  </nav>

  <div class="breadcrumb">
    <a href="/">Home</a> > ${city ? `<a href="/locations/${city.toLowerCase()}/">${city}</a> > ` : ''}${serviceName}
  </div>

  <section class="page-hero" style="padding: 80px 24px; text-align: center; background: var(--navy); color: white;">
    <h1 style="font-family: 'Playfair Display', serif; font-size: 48px; margin-bottom: 20px;">${h1}</h1>
    <p style="font-size: 18px; color: rgba(255,255,255,0.7); max-width: 800px; margin: 0 auto 32px;">${lead}</p>
    <div style="display: flex; gap: 16px; justify-content: center;">
      <a href="tel:+919312264832" class="btn btn-gold" style="text-decoration:none;">Call +91 93122 64832</a>
      <a href="https://wa.me/919312264832" class="btn btn-navy" style="text-decoration:none;">WhatsApp Now</a>
    </div>
  </section>

  <section class="content-section">
    <h2>Professional ${serviceName} ${city ? 'in ' + city : 'Delhi NCR'}</h2>
    <p>Air Control provides expert ${serviceName.toLowerCase()} with 38 years of experience. Whether you need emergency repairs, routine maintenance, or a new installation, our certified engineers are ready to help.</p>
    
    ${type === 'city_hub' ? `
    <div class="grid-cards">
      ${services.map(s => `
        <div class="card-item">
          <h3>${s.name} in ${city}</h3>
          <p>Expert ${s.name.toLowerCase()} services across all areas of ${city}.</p>
          <a href="/locations/${city.toLowerCase()}/${s.id}/">View Details →</a>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${type === 'service' ? `
    <div class="grid-cards">
      ${cities.map(c => `
        <div class="card-item">
          <h3>${serviceName} in ${c.name}</h3>
          <p>Professional ${serviceName.toLowerCase()} in ${c.name} and surrounding areas.</p>
          <a href="/locations/${c.id}/${canonical.split('/')[2]}/">View Details →</a>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <h2 style="margin-top: 60px;">Areas We Serve ${city ? 'in ' + city : ''}</h2>
    <p>${city ? micromarkets[city.toLowerCase()] : Object.values(micromarkets).join(', ')}</p>

    <h2 style="margin-top: 60px;">Frequently Asked Questions</h2>
    <div class="faq-item">
      <h3>Why choose Air Control for ${serviceName} ${city ? 'in ' + city : ''}?</h3>
      <p>With over 38 years of experience, we provide engineering-grade HVAC solutions. We use only safe, non-flammable refrigerants and guarantee a 2-hour emergency response.</p>
    </div>
    <div class="faq-item">
      <h3>Do you provide same-day service?</h3>
      <p>Yes, we offer same-day service and emergency response across Delhi NCR for critical HVAC issues.</p>
    </div>
    <div class="faq-item">
      <h3>What brands do you service?</h3>
      <p>We service all major brands including Daikin, Voltas, Blue Star, LG, Samsung, Carrier, Hitachi, Panasonic, O'General, and Mitsubishi.</p>
    </div>
  </section>

  <footer style="background: var(--navy-deep); padding: 60px 48px; color: white; margin-top: 60px;">
    <div style="max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px;">
      <div>
        <h3 style="color: var(--gold); margin-bottom: 20px; font-family: 'Playfair Display', serif;">Air Control</h3>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px;">Delhi's most trusted HVAC engineering company since 1987.</p>
      </div>
      <div>
        <h4 style="color: var(--gold); margin-bottom: 20px;">Services</h4>
        <ul style="list-style: none; padding: 0; line-height: 2;">
          <li><a href="/services/ac-repair/" style="color: rgba(255,255,255,0.6); text-decoration: none;">AC Repair</a></li>
          <li><a href="/services/ac-service/" style="color: rgba(255,255,255,0.6); text-decoration: none;">AC Service</a></li>
          <li><a href="/services/ac-installation/" style="color: rgba(255,255,255,0.6); text-decoration: none;">AC Installation</a></li>
          <li><a href="/services/ac-amc/" style="color: rgba(255,255,255,0.6); text-decoration: none;">AC AMC</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: var(--gold); margin-bottom: 20px;">Locations</h4>
        <ul style="list-style: none; padding: 0; line-height: 2;">
          <li><a href="/locations/delhi/" style="color: rgba(255,255,255,0.6); text-decoration: none;">Delhi</a></li>
          <li><a href="/locations/gurgaon/" style="color: rgba(255,255,255,0.6); text-decoration: none;">Gurgaon</a></li>
          <li><a href="/locations/noida/" style="color: rgba(255,255,255,0.6); text-decoration: none;">Noida</a></li>
          <li><a href="/locations/faridabad/" style="color: rgba(255,255,255,0.6); text-decoration: none;">Faridabad</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: var(--gold); margin-bottom: 20px;">Contact</h4>
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 2;">
          📞 +91 93122 64832<br>
          ✉️ ajay@aircontrols.in<br>
          📍 New Delhi, India
        </p>
      </div>
    </div>
  </footer>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Service"],
    "name": "Air Control",
    "serviceType": "${serviceName}",
    "areaServed": "${city ? city : 'Delhi NCR'}",
    "telephone": "+919312264832",
    "url": "https://aircontrols.in${canonical}"
  }
  </script>
</body>
</html>`;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const sitemapUrls = [];

// 1. Service Pages (4)
ensureDir('./services');
services.forEach(s => {
  const dir = `./services/${s.id}`;
  ensureDir(dir);
  const canonical = `/services/${s.id}/`;
  const html = template(
    `${s.name} Delhi NCR | Air Control Since 1987`,
    `Expert ${s.name.toLowerCase()} services across Delhi NCR. 38 years of experience, 2-hour emergency response. Call +91 93122 64832.`,
    `${s.name.toLowerCase()} delhi, ${s.name.toLowerCase()} gurgaon, ${s.name.toLowerCase()} noida, ${s.name.toLowerCase()} faridabad`,
    canonical,
    `${s.name} Delhi NCR`,
    `Professional ${s.name.toLowerCase()} services for residential, commercial, and industrial clients across Delhi NCR.`,
    'service',
    null,
    s.name
  );
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  sitemapUrls.push({ loc: canonical, priority: '0.9' });
});

// 2. City Hub Pages (4)
ensureDir('./locations');
cities.forEach(c => {
  const dir = `./locations/${c.id}`;
  ensureDir(dir);
  const canonical = `/locations/${c.id}/`;
  const html = template(
    `AC Repair & Service in ${c.name} | Air Control`,
    `Top-rated AC repair, service, installation, and AMC in ${c.name}. Trusted by embassies and Fortune 500 companies. Call +91 93122 64832.`,
    `ac repair ${c.name.toLowerCase()}, ac service ${c.name.toLowerCase()}, ac installation ${c.name.toLowerCase()}, ac amc ${c.name.toLowerCase()}`,
    canonical,
    `AC Repair & Service in ${c.name}`,
    `Comprehensive air conditioning solutions in ${c.name} with a 100% safety record and 38 years of trust.`,
    'city_hub',
    c.name,
    'AC Services'
  );
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  sitemapUrls.push({ loc: canonical, priority: '0.8' });

  // 3. City x Service Pages (16)
  services.forEach(s => {
    const subDir = `./locations/${c.id}/${s.id}`;
    ensureDir(subDir);
    const subCanonical = `/locations/${c.id}/${s.id}/`;
    const subHtml = template(
      `${s.name} in ${c.name} | Air Control`,
      `Professional ${s.name.toLowerCase()} in ${c.name}. Fast response, expert engineers, and guaranteed satisfaction. Call +91 93122 64832.`,
      `${s.name.toLowerCase()} ${c.name.toLowerCase()}, best ${s.name.toLowerCase()} in ${c.name.toLowerCase()}`,
      subCanonical,
      `${s.name} in ${c.name}`,
      `Expert ${s.name.toLowerCase()} services covering all major areas and sectors in ${c.name}.`,
      'city_service',
      c.name,
      s.name
    );
    fs.writeFileSync(path.join(subDir, 'index.html'), subHtml);
    sitemapUrls.push({ loc: subCanonical, priority: '0.9' });
  });
});

// Update sitemap.xml
let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aircontrols.in/</loc>
    <lastmod>2025-04-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

const today = new Date().toISOString().split('T')[0];
sitemapUrls.forEach(url => {
  sitemapContent += `  <url>
    <loc>https://aircontrols.in${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
});

sitemapContent += `</urlset>`;
fs.writeFileSync('./sitemap.xml', sitemapContent);

console.log('Generated 24 pages and updated sitemap.xml');
