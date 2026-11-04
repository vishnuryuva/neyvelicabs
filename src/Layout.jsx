import {useState} from "react";
import {Link,NavLink} from "react-router-dom";
import {SITE,tel,wa} from "./data";
const nav=[["Home","/"],["One Way","/one-way-drop-taxi"],["Airport","/airport-taxi"],["Outstation","/outstation-taxi"],["Routes","/routes"],["Tariff","/tariff"],["Services","/service"],["About","/about"],["Contact","/contact"]];
export const Img=({src,label="Image",className=""})=>src?<img className={`img ${className}`} src={src} alt={label} loading="lazy"/>:<div className={`img ph ${className}`}><span>🚕</span><small>{label}</small></div>;
export const Head=({title,sub})=><section className="pagehead"><div className="wrap"><h1>{title}</h1>{sub&&<p>{sub}</p>}</div></section>;
export const Actions=({msg="Hello, I would like to book a cab."})=><div className="actions"><a className="btn wa" href={wa(msg)} target="_blank" rel="noreferrer">WhatsApp</a><a className="btn call" href={tel}>Call Now</a></div>;
export default function Layout({children}){
const [open,setOpen]=useState(false);
return(<>
<div className="topbar"><div className="wrap"><span>24/7 Drop Taxi Service</span><span><a href={tel}>📞 {SITE.display}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a></span></div></div>
<header className="hdr"><div className="wrap row">
<Link to="/" className="logo">🚕 <b>NFS</b> Cabs</Link>
<button className="burger" onClick={()=>setOpen(!open)} aria-label="Menu">☰</button>
<nav className={open?"open":""} onClick={()=>setOpen(false)}>{nav.map(([n,p])=><NavLink key={p} to={p} end={p==="/"}>{n}</NavLink>)}<Link className="btn solid" to="/book">Book Now</Link></nav>
</div></header>
<main>{children}</main>
<footer className="ftr"><div className="wrap grid4">
<div><div className="logo">🚕 <b>NFS</b> Cabs</div><p>24/7 one way drop taxi and outstation cabs across Tamil Nadu.</p><p>📞 <a href={tel}>{SITE.display}</a><br/>✉️ {SITE.email}<br/>📍 {SITE.address}</p><a href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
<div><h4>Quick Links</h4>{nav.map(([n,p])=><Link key={p} to={p}>{n}</Link>)}<Link to="/book">Book Now</Link></div>
<div><h4>Popular Cities</h4>{["madurai","chennai","trichy","coimbatore","salem","pondicherry","ooty","bangalore"].map(s=><Link key={s} to={`/routes/${s}`}>{s[0].toUpperCase()+s.slice(1)} Drop Taxi</Link>)}</div>
<div><h4>Company</h4><Link to="/terms">Terms of use</Link><Link to="/privacy">Privacy policy</Link><a href={SITE.reviews} target="_blank" rel="noreferrer">Google reviews</a></div>
</div><div className="copy">© {new Date().getFullYear()} {SITE.name} — All Rights Reserved.</div></footer>
<div className="float"><a className="fab wa" href={wa("Hello, I would like to book a cab.")} target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a><a className="fab call" href={tel} aria-label="Call">📞</a></div>
</>)}
