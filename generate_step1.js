import fs from 'fs';
import path from 'path';

const indexHtml = fs.readFileSync('./index.html', 'utf-8');

// 1. Extract CSS
const styleRegex = /<style>([\s\S]*?)<\/style>/;
const match = indexHtml.match(styleRegex);

if (match) {
  const cssContent = match[1];
  
  if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets');
  }
  fs.writeFileSync('./assets/site.css', cssContent);
  console.log('Extracted CSS to assets/site.css');

  let newIndexHtml = indexHtml.replace(styleRegex, '<link rel="stylesheet" href="/assets/site.css">');

  // 2. Update navigation
  // Find the nav links list
  const navLinksRegex = /<ul class="nav-links-list">([\s\S]*?)<\/ul>/;
  const navLinksMatch = newIndexHtml.match(navLinksRegex);
  
  if (navLinksMatch) {
    const newNavLinks = `
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
  <style>
    .dropdown { position: relative; display: inline-block; }
    .dropdown-content { display: none; position: absolute; background-color: rgba(10,22,40,0.97); min-width: 160px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1; border-radius: 6px; }
    .dropdown-content a { color: rgba(255,255,255,.78); padding: 12px 16px; text-decoration: none; display: block; }
    .dropdown-content a:hover { background-color: rgba(200,168,75,.08); color: var(--gold); }
    .dropdown:hover .dropdown-content { display: block; }
  </style>
`;
    newIndexHtml = newIndexHtml.replace(navLinksRegex, newNavLinks);
  }

  // Update footer links
  // We can do a simple replace for the footer columns
  const footerServicesRegex = /<h4>AC Services<\/h4>\s*<ul>([\s\S]*?)<\/ul>/;
  const newFooterServices = `<h4>AC Services</h4>
          <ul>
            <li><a href="/services/ac-repair/">AC Repair Delhi NCR</a></li>
            <li><a href="/services/ac-service/">AC Service & AMC</a></li>
            <li><a href="/services/ac-installation/">AC Installation</a></li>
            <li><a href="/services/ac-amc/">AC AMC Contracts</a></li>
            <li><a href="/#services">VRF / VRV Systems</a></li>
          </ul>`;
  newIndexHtml = newIndexHtml.replace(footerServicesRegex, newFooterServices);

  const footerPagesRegex = /<h4>Pages<\/h4>\s*<ul>([\s\S]*?)<\/ul>/;
  const newFooterPages = `<h4>Pages</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/locations/delhi/">Delhi AC Services</a></li>
            <li><a href="/locations/gurgaon/">Gurgaon AC Services</a></li>
            <li><a href="/locations/noida/">Noida AC Services</a></li>
            <li><a href="/locations/faridabad/">Faridabad AC Services</a></li>
          </ul>`;
  newIndexHtml = newIndexHtml.replace(footerPagesRegex, newFooterPages);

  fs.writeFileSync('./index.html', newIndexHtml);
  console.log('Updated index.html');
} else {
  console.log('Could not find <style> block');
}
