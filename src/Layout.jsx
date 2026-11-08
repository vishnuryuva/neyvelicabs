import {createContext, useContext, useState} from "react";
import {Link,NavLink} from "react-router-dom";
import {SITE,tel,wa} from "./data";

export const LanguageContext = createContext({lang:"en", setLang:()=>{}});
export const useLanguage = () => useContext(LanguageContext);

const navByLang = {
  en: [["Home","/"],["One Way","/one-way-drop-taxi"],["Airport","/airport-taxi"],["Outstation","/outstation-taxi"],["Routes","/routes"],["Gallery","/gallery"],["Tariff","/tariff"],["Services","/service"],["About","/about"],["Contact","/contact"]],
  ta: [["முகப்பு","/"],["ஒன் வே","/one-way-drop-taxi"],["ஏர்போர்ட்","/airport-taxi"],["அவுட்ஸ்டேஷன்","/outstation-taxi"],["ரூட்ஸ்","/routes"],["கேலரி","/gallery"],["டாரிஃப்","/tariff"],["சேவைகள்","/service"],["எங்களைப் பற்றி","/about"],["தொடர்பு","/contact"]]
};

export const Img=({src,label="Image",className=""})=>src?<img className={`img ${className}`} src={src} alt={label} loading="lazy"/>:<div className={`img ph ${className}`}><span>🚕</span><small>{label}</small></div>;
export const Head=({title,sub})=><section className="pagehead"><div className="wrap"><h1>{title}</h1>{sub&&<p>{sub}</p>}</div></section>;
export const Actions=({msg="Hello Epic Drop Taxi, I would like to book a cab."})=><div className="actions"><a className="btn wa" href={wa(msg)} target="_blank" rel="noreferrer">WhatsApp</a><a className="btn call" href={tel}>Call Now</a></div>;

export default function Layout({children}){
const [open,setOpen]=useState(false);
const [lang,setLang]=useState("en");
const nav = navByLang[lang];

return(<LanguageContext.Provider value={{lang,setLang}}>
<div className="topbar"><div className="wrap"><span>24/7 Drop Taxi Service</span><span><a href={tel}>📞 {SITE.display}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a></span></div></div>
<header className="hdr"><div className="wrap row">
<Link to="/" className="brand" aria-label="Epic Drop Taxi home"><img src="/drop-taxi-logo.png" alt="Epic Drop Taxi" className="brand-logo" /></Link>
<div className="hdr-actions">
<button className="lang-switch" onClick={()=>setLang(lang==="en"?"ta":"en")} aria-label="Toggle language">{lang === "en" ? "தமிழ்" : "EN"}</button>
<button className="burger" onClick={()=>setOpen(!open)} aria-label="Menu">☰</button>
</div>
<nav className={open?"open":""} onClick={()=>setOpen(false)}>{nav.map(([n,p])=><NavLink key={p} to={p} end={p==="/"}>{n}</NavLink>)}<Link className="btn solid" to="/book">{lang === "en" ? "Book Now" : "புக் செய்யுங்கள்"}</Link></nav>
</div></header>
<main>{children}</main>
<footer className="ftr"><div className="wrap grid4">
<div><div className="brand footer-brand"><img src="/drop-taxi-logo.png" alt="Epic Drop Taxi" className="brand-logo" /></div><p>{lang === "en" ? "24/7 one way drop taxi and outstation cabs across Tamil Nadu." : "தமிழ்நாடு முழுவதும் 24/7 ஒன் வே டிராப் டாக்ஸி மற்றும் அவுட்ஸ்டேஷன் கேப்ஸ்."}</p><p>📞 <a href={tel}>{SITE.display}</a><br/>✉️ {SITE.email}<br/>📍 {SITE.address}</p><a href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a></div>
<div><h4>{lang === "en" ? "Quick Links" : "விரைவு இணைப்புகள்"}</h4>{nav.map(([n,p])=><Link key={p} to={p}>{n}</Link>)}<Link to="/book">{lang === "en" ? "Book Now" : "புக் செய்யுங்கள்"}</Link></div>
<div><h4>{lang === "en" ? "Popular Cities" : "பிரபல நகரங்கள்"}</h4>{["madurai","chennai","trichy","coimbatore","salem","pondicherry","ooty","bangalore"].map(s=><Link key={s} to={`/routes/${s}`}>{s[0].toUpperCase()+s.slice(1)} Drop Taxi</Link>)}</div>
<div><h4>{lang === "en" ? "Company" : "நிறுவனம்"}</h4><Link to="/terms">{lang === "en" ? "Terms of use" : "பயன்பாட்டு விதிமுறைகள்"}</Link><Link to="/privacy">{lang === "en" ? "Privacy policy" : "தனியுரிமை கொள்கை"}</Link><a href={SITE.reviews} target="_blank" rel="noreferrer">{lang === "en" ? "Google reviews" : "கூகுள் மதிப்புரைகள்"}</a></div>
</div><div className="copy">© {new Date().getFullYear()} {SITE.name} — {lang === "en" ? "All Rights Reserved." : "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."}</div></footer>
<div className="float"><a className="fab wa" href={wa("Hello Epic Drop Taxi, I would like to book a cab.")} target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a><a className="fab call" href={tel} aria-label="Call">📞</a></div>
</LanguageContext.Provider>)}
