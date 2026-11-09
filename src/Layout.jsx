import {Children,cloneElement,createContext,isValidElement,useContext,useEffect,useState} from "react";
import {Link,NavLink} from "react-router-dom";
import {SITE,tel,wa} from "./data";
import {translate} from "./i18n";

export const LanguageContext = createContext({lang:"en", setLang:()=>{}});
export const useLanguage = () => useContext(LanguageContext);

function localizeNode(node,lang) {
  if (typeof node === "string") return translate(lang,node);
  if (!isValidElement(node)) return node;
  const props = {};
  for (const attribute of ["placeholder","aria-label","title","alt","sub","tag","label","msg"]) {
    if (typeof node.props[attribute] === "string") {
      props[attribute] = translate(lang,node.props[attribute]);
    }
  }
  if (node.props.children !== undefined) {
    props.children = Children.map(node.props.children,child=>localizeNode(child,lang));
  }
  return cloneElement(node,props);
}

export function LocalizedContent({children}) {
  const {lang} = useLanguage();
  return <>{Children.map(children,child=>localizeNode(child,lang))}</>;
}

const navByLang = {
  en: [["Home","/"],["One Way","/one-way-drop-taxi"],["Airport","/airport-taxi"],["Outstation","/outstation-taxi"],["Routes","/routes"],["Gallery","/gallery"],["Tariff","/tariff"],["Services","/service"],["About","/about"],["Contact","/contact"]],
  ta: [["முகப்பு","/"],["ஒன் வே","/one-way-drop-taxi"],["ஏர்போர்ட்","/airport-taxi"],["அவுட்ஸ்டேஷன்","/outstation-taxi"],["ரூட்ஸ்","/routes"],["கேலரி","/gallery"],["டாரிஃப்","/tariff"],["சேவைகள்","/service"],["எங்களைப் பற்றி","/about"],["தொடர்பு","/contact"]]
};

export const Img=({src,label="Image",className=""})=>src?<img className={`img ${className}`} src={src} alt={label} loading="lazy"/>:<div className={`img ph ${className}`}><span>🚕</span><small>{label}</small></div>;
export const Head=({title,sub})=><LocalizedContent><section className="pagehead"><div className="wrap"><h1>{title}</h1>{sub&&<p>{sub}</p>}</div></section></LocalizedContent>;
export const Actions=({msg="Hello Epic Drop Taxi, I would like to book a cab."})=><LocalizedContent><div className="actions"><a className="btn wa" href={wa(msg)} target="_blank" rel="noreferrer">WhatsApp</a><a className="btn call" href={tel}>Call Now</a></div></LocalizedContent>;

export default function Layout({children}){
const [open,setOpen]=useState(false);
const [lang,setLang]=useState("en");
const nav = navByLang[lang];
useEffect(()=>{document.documentElement.lang=lang==="ta"?"ta":"en";},[lang]);

return(<LanguageContext.Provider value={{lang,setLang}}>
<LocalizedContent>
<div className="topbar"><div className="wrap"><span>24/7 Drop Taxi Service</span><span><a href={tel}>📞 {SITE.display}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a></span></div></div>
<header className="hdr"><div className="wrap row">
<Link to="/" className="brand" aria-label="Epic Drop Taxi home"><img src="/drop-taxi-logo.png" alt="Epic Drop Taxi" className="brand-logo" /></Link>
<div className="hdr-actions">
<button className="lang-switch" onClick={()=>setLang(lang==="en"?"ta":"en")} aria-label={lang==="en"?"Switch to Tamil":"Switch to English"}>{lang === "en" ? "தமிழ்" : "EN"}</button>
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
<div className="float">
<a className="fab wa" href={wa("Hello Epic Drop Taxi, I would like to book a cab.")} target="_blank" rel="noreferrer" aria-label={lang==="en"?"Chat on WhatsApp":"வாட்ஸ்அப்பில் உரையாடவும்"}>
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.3-4.9a8.4 8.4 0 1 1 16.2-3.8Z"/><path d="M8.2 7.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.6.7c-.2.2-.2.4 0 .6.6 1 1.5 1.8 2.5 2.3.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.6-.5.5-1.2.7-1.9.6-1.2-.2-2.6-.8-4.1-2.2-1.2-1.1-2-2.5-2.3-3.6-.3-1.1.1-2 .5-2.6Z"/></svg>
 </a>
<a className="fab call" href={tel} aria-label={lang==="en"?"Call us":"அழைக்கவும்"}>
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5h3.1l1.5 4.1-2 1.7a15.4 15.4 0 0 0 6.9 6.9l1.7-2 4.1 1.5v3.1a1.7 1.7 0 0 1-1.8 1.7A16.9 16.9 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8Z"/></svg>
 </a></div>
</LocalizedContent>
</LanguageContext.Provider>)}
