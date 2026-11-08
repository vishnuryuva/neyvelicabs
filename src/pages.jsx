import {useEffect,useState} from "react";
import {Link,useParams,useSearchParams} from "react-router-dom";
import {SITE,IMG,wa,tel,cities,journeys,cars,bata,tariff,permits,reviews,faqs,services,allServices} from "./data";
import {Img,Head,Actions,useLanguage} from "./Layout";
const useTitle=t=>{
  useEffect(() => {
    document.title = `${t} | ${SITE.name}`;
  }, [t]);
};
const cap=s=>s.split("-").map(w=>w[0].toUpperCase()+w.slice(1)).join(" ");
const Sec=({title,tag,children,alt})=><section className={`sec ${alt?"alt":""}`}><div className="wrap">{tag&&<small className="tag">{tag}</small>}{title&&<h2>{title}</h2>}{children}</div></section>;
const CarCards=()=><div className="grid4">{cars.map(c=><div className="card" key={c.id}><Img label={c.name} src={IMG.cars?.[c.id]} className="h160"/><div className="pad"><h3>{c.name}</h3><p className="muted">{c.models} · {c.seats} seater · {c.bags} bags</p><p><b>₹{c.one}/km</b><br/>Driver Bata ₹{c.driverBata}<br/>Min {c.minimum} KM</p><p className="muted sm">One-way toll charges extra.</p><div className="actions"><Link className="btn solid" to={`/book?car=${c.id}`}>Book</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nCar: ${c.name}\nPlease share availability and booking details.`)} target="_blank" rel="noreferrer">WhatsApp</a></div></div></div>)}</div>;
const GalleryGrid=()=><div className="grid3">{IMG.gallery.map((url,i)=><div className="card" key={url+i}><img className="gallery-image" src={url} alt={`Epic Drop Taxi cab photo ${i+1}`} /></div>)}</div>;
const Reviews=()=><Sec title="What Our Riders Say" tag="4.9★ · Google Reviews" alt><div className="grid4">{reviews.map(([n,t])=><div className="card pad" key={n}><p>“{t}”</p><b>{n}</b><div className="muted sm">Google Review</div></div>)}</div><div className="actions center"><a className="btn solid" href={SITE.reviews} target="_blank" rel="noreferrer">Read reviews</a><a className="btn ghost" href={SITE.write} target="_blank" rel="noreferrer">Write a review</a></div></Sec>;
const Gallery=()=><Sec title="Our Fleet Gallery" tag="Cab photos" alt><GalleryGrid/></Sec>;
const Faq=()=><Sec title="One Way Taxi FAQs">{faqs.map(([q,a])=><details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}</Sec>;
const CTA=()=><section className="cta"><div className="wrap"><h2>Ready to book a one way taxi?</h2><p>Share your journey details to get a current quote and vehicle availability.</p><Actions/></div></section>;

function HeroVisual({pricingMode}){
  const display = [
    {label:"Mini", value: pricingMode === "one-way" ? 14 : 18},
    {label:"Sedan", value: pricingMode === "one-way" ? 15 : 20},
    {label:"SUV", value: pricingMode === "one-way" ? 20 : 26}
  ];
  return <div className="hero-visual"><div className="hero-image-wrap"><Img label="Neyveli city taxi" src={IMG.cities.neyveli} className="hero-image" /></div><div className="price-strip">{display.map(item=><div className="price-pill" key={item.label}><strong>₹{item.value}/km</strong><span>{item.label}</span></div>)}</div></div>;
}

export function Home(){
  const {lang}=useLanguage();
  const [pricingMode,setPricingMode]=useState("one-way");
  const tripCopy = {
    "one-way": {label: lang === "en" ? "One Way" : "ஒன் வே", toll: lang === "en" ? "One-way toll charges" : "ஒன்-வேயில் டோல் கட்டணம்", note: lang === "en" ? "Single trip fare" : "ஒற்றை பயண விலை"},
    "round-trip": {label: lang === "en" ? "Round Trip" : "ரவுண்ட் டிரிப்", toll: lang === "en" ? "Return tolls and parking extra" : "மீண்டும் செல்லும் டோல் மற்றும் பார்க்கிங் கூடுதல்", note: lang === "en" ? "Back-and-forth fare" : "மறுபுறம் செல்லும் விலை"}
  };
  useTitle(lang === "en" ? "One Way Drop Taxi & Outstation Cabs in Tamil Nadu" : "தமிழ்நாட்டில் ஒன் வே டிராப் டாக்ஸி & அவுட்ஸ்டேஷன் கேப்ஸ்");
  return(<>
<section className="hero"><div className="wrap two"><div>
<small className="tag">{lang === "en" ? "Tamil Nadu · Puducherry · Bengaluru · Kerala" : "தமிழ்நாடு · புதுச்சேரி · பெங்களூர் · கேரளம்"}</small>
<h1>{lang === "en" ? "One Way Drop Taxi & Outstation Cabs Across Tamil Nadu" : "தமிழ்நாடு முழுவதும் ஒன் வே டிராப் டாக்ஸி & அவுட்ஸ்டேஷன் கேப்ஸ்"}</h1>
<p>{lang === "en" ? "Safe, reliable and affordable. Professional drivers, transparent pricing, 24/7 support." : "பாதுகாப்பான, நம்பகமான மற்றும் மலிவு. தொழில்முறை ஓட்டுநர்கள், வெளிப்படையான விலை, 24/7 உதவி."}</p>
<Actions/>
<div className="stats">{[["5K+",lang === "en" ? "Trips Done" : "பயணங்கள்"],["100+",lang === "en" ? "Routes" : "ரூட்ஸ்"],["24/7",lang === "en" ? "Support" : "உதவி"],["4.9★",lang === "en" ? "Rating" : "மதிப்பீடு"]].map(([a,b])=><div key={b}><b>{a}</b><span>{b}</span></div>)}</div></div>
<div className="hero-side"><QuickBook/><HeroVisual pricingMode={pricingMode}/></div></div></section>
<Sec title={lang === "en" ? "One Way Taxi Pricing & Round Trip Fare Details" : "ஒன் வே டாக்ஸி விலை & ரவுண்ட் டிரிப் கட்டண விவரங்கள்"} tag={lang === "en" ? "Fixed fare • No hidden charges • Instant booking" : "நிலையான விலை • மறைக்கப்பட்ட கட்டணங்கள் இல்லை • உடனடி புக்"}><div className="pricing-toggle">{["one-way","round-trip"].map(mode=><button key={mode} type="button" aria-pressed={pricingMode===mode} className={pricingMode === mode ? "active" : ""} onClick={()=>setPricingMode(mode)}>{tripCopy[mode].label}</button>)}</div><div className="grid4 pricing-grid">{cars.map(c=><div className="card pricing-card" key={c.id}><Img label={c.name} src={IMG.cars?.[c.id]} className="h160"/><div className="pad"><h3>{c.name}</h3><p className="big-price">₹{pricingMode === "one-way" ? c.one : c.round}/KM</p><p className="muted"><small>{tripCopy[pricingMode].note}</small></p><p className="muted">{lang === "en" ? "Driver Bata" : "டிரைவர் பாத்தா"} ₹{c.driverBata}</p><p className="muted">{lang === "en" ? "Min" : "குறைந்தபட்சம்"} {pricingMode === "one-way" ? c.minimum : c.minimum + 100} {lang === "en" ? "KM" : "கிமீ"}</p><p className="muted sm">{tripCopy[pricingMode].toll}</p><Link className="btn solid" to={`/book?car=${c.id}`}>{lang === "en" ? "Book Now" : "இப்போது புக்"}</Link></div></div>)}</div></Sec>
<Sec title={lang === "en" ? "Popular One Way Taxi Routes" : "பிரபலமான ஒன் வே டாக்ஸி ரூட்ஸ்"} tag={lang === "en" ? "One Way Taxi Services" : "ஒன் வே டாக்ஸி சேவைகள்"}><div className="city-strip">{cities.slice(0,12).map(([s,n,d])=><div className="card city-card" key={s}><Img label={n} src={IMG.cities[s]} className="h160"/><div className="pad"><h3><Link to={`/routes/${s}`}>{n} Drop Taxi</Link></h3><p className="muted">{d}</p><div className="actions"><Link className="btn solid" to={`/book?from=${s}`}>{lang === "en" ? "Book Now" : "இப்போது புக்"}</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nRoute: ${n} Drop Taxi\nPlease share availability and current fare.`)} target="_blank" rel="noreferrer">WhatsApp</a></div></div></div>)}</div><div className="actions center"><Link className="btn ghost" to="/routes">{lang === "en" ? "View all routes" : "அனைத்து ரூட்ஸையும் பார்க்க"}</Link></div></Sec>
<Sec title={lang === "en" ? "One Way Taxi Service in Tamil Nadu" : "தமிழ்நாட்டில் ஒன் வே டாக்ஸி சேவை"} alt><div className="grid3">{Object.entries(services).map(([k,v])=><div className="card pad" key={k}><h3>{v.title}</h3><p className="muted">{v.intro}</p><Link to={`/${k}`}>{lang === "en" ? "Read more" : "மேலும் படிக்க"} →</Link></div>)}</div><h4 className="mt">{lang === "en" ? "Popular journeys" : "பிரபலமான பயணங்கள்"}</h4><div className="chips">{journeys.map(j=><Link key={j} to={`/routes/${j}`}>{cap(j).replace(" To "," to ")}</Link>)}</div></Sec>
<Sec title={lang === "en" ? "Drop Taxi from Neyveli, Cuddalore & Nearby Towns" : "நெய்வேலி, கடலூர் & அருகிலுள்ள நகரங்களிலிருந்து டிராப் டாக்ஸி"} tag={lang === "en" ? "Our home base" : "எங்கள் வீட்டு தளம்"}><p className="lead">{lang === "en" ? "Based in Vadakuthu, Neyveli. Book from Neyveli, Vadalur, Panruti, Virudhachalam, Cuddalore, Chidambaram, Villupuram or Puducherry to any city and pay only for the journey you take." : "வாடாகுத்து, நெய்வேலியில் அமைந்துள்ளது. நெய்வேலி, வடலூர், பண்ருட்டி, விருத்தாசலம், கடலூர், சிதம்பரம், விழுப்புரம் அல்லது புதுச்சேரி ஆகிய இடங்களிலிருந்து எந்த நகருக்கும் புக் செய்து, நீங்கள் பயணிக்கும் தூரத்திற்கே பணம் செலுத்துங்கள்."}</p><p className="muted">{lang === "en" ? "We also serve outstation rides from Neyveli to Chennai, Puducherry, Bengaluru, Trichy and Madurai with transparent, pay-by-distance pricing across every journey." : "நெய்வேலி முதல் சென்னை, புதுச்சேரி, பெங்களூர், திருச்சி, மதுரை வரை வெளிநகர பயணங்களை வெளிப்படையான தூர அடிப்படையிலான விலையில் வழங்குகிறோம்."}</p></Sec>
<Gallery/>
<Sec title={lang === "en" ? "Why Choose Epic Drop Taxi?" : "ஏன் எபிக் டிராப் டாக்ஸியை தேர்வு செய்ய வேண்டும்?"}><div className="grid4">{[["💰",lang === "en" ? "Pay for the trip you book" : "நீங்கள் புக் செய்த பயணத்திற்கே பணம்","No billing for an empty return on one way drops."],["🧾",lang === "en" ? "See your fare instantly" : "விலையை உடனே பார்க்கவும்","Approximate fare with breakdown, confirmed on WhatsApp."],["✅",lang === "en" ? "Verified drivers" : "சரிபார்க்கப்பட்ட ஓட்டுநர்கள்","Professional drivers and well-maintained cabs."],["🕒",lang === "en" ? "Book any time" : "எப்போது வேண்டுமானாலும் புக்","Call, WhatsApp or booking form, 24/7."]].map(([i,t,d])=><div className="card pad" key={t}><div className="big">{i}</div><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></Sec>
<Reviews/><Faq/><CTA/></>) }

function QuickBook(){const {lang}=useLanguage();const [f,setF]=useState({type:"One Way",from:"",to:"",car:"sedan"});const s=k=>e=>setF({...f,[k]:e.target.value});
return <form className="qb" onSubmit={e=>{e.preventDefault();window.open(wa(`*New Booking Enquiry*\nTrip: ${f.type}\nFrom: ${f.from}\nTo: ${f.to}\nCar: ${f.car}`),"_blank")}}><h3>{lang === "en" ? "Book Your Ride" : "உங்கள் சவாரியை புக் செய்யுங்கள்"}</h3><p className="muted sm">{lang === "en" ? "Get instant fare. No hidden charges." : "உடனடி விலை. மறைக்கப்பட்ட கட்டணங்கள் இல்லை."}</p>
<select value={f.type} onChange={s("type")}><option>{lang === "en" ? "One Way" : "ஒன் வே"}</option><option>{lang === "en" ? "Round Trip" : "ரவுண்ட் டிரிப்"}</option></select>
<input required placeholder={lang === "en" ? "📍 Pickup city" : "📍 பிக்கப் நகரம்"} value={f.from} onChange={s("from")}/><input required placeholder={lang === "en" ? "📍 Drop city" : "📍 டிராப் நகரம்"} value={f.to} onChange={s("to")}/>
<select value={f.car} onChange={s("car")}>{cars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
<button className="btn solid full">{lang === "en" ? "Book on WhatsApp" : "வாட்ஸ்அப்பில் புக்"}</button><Link className="btn ghost full" to="/book">{lang === "en" ? "Full booking form" : "முழு புக் பக்கம்"}</Link></form>}

export function Service({k}){const v=services[k];useTitle(v.title);return(<><Head title={v.title} sub={v.intro}/>
<Sec><div className="two"><Img label={v.title} src={IMG[v.img]} className="h320"/><div><h2>How it works</h2><ul className="ticks">{v.points.map(p=><li key={p}>{p}</li>)}</ul><ol className="steps"><li>Share pickup, drop, date and passengers</li><li>We confirm vehicle and fare</li><li>Driver arrives on time</li></ol><Actions msg={`Hello, I need ${v.title}.`}/></div></div></Sec>
<Sec title="Choose your car" alt><CarCards/></Sec><Faq/><CTA/></>)}

export function RoutesPage(){useTitle("One Way Taxi Routes");return(<><Head title="One Way Taxi Routes" sub="Pick your city for route details, or share your journey and we will confirm."/>
<Sec title="Popular journeys"><div className="chips">{journeys.map(j=><Link key={j} to={`/routes/${j}`}>{cap(j).replace(" To "," to ")}</Link>)}</div></Sec>
<Sec title="All cities" alt><div className="grid3">{cities.map(([s,n,d])=><Link to={`/routes/${s}`} className="card pad" key={s}><h3>{n} Drop Taxi</h3><p className="muted">{d}</p></Link>)}</div></Sec><CTA/></>)}

export function RouteDetail(){const {slug}=useParams();const c=cities.find(x=>x[0]===slug);
const j=slug.includes("-to-")?slug.split("-to-").map(cap):null;const name=j?`${j[0]} to ${j[1]}`:c?c[1]:cap(slug);const title=`${name} One Way Taxi`;useTitle(title);
return(<><Head title={title} sub={c?c[2]:"Share pickup, drop, date and passenger count and we will confirm the vehicle and fare before pickup."}/>
<Sec><div className="two"><Img label={name} src={c&&IMG.cities[c[0]]} className="h320"/><div><h2>Book a {name} cab</h2><p>Pay only for the journey you book. Fare is the per-km rate × distance (150 km minimum) plus driver bata. Toll, permit, parking, waiting and hill charges are extra.</p><ul className="ticks"><li>Mini from ₹14/km</li><li>Sedan from ₹15/km</li><li>SUV from ₹20/km</li><li>Innova / Crysta / High Cross / Tempo Traveller available</li><li>24/7 pickups</li></ul><div className="actions"><Link className="btn solid" to={`/book?from=${j?j[0]:name}${j?`&to=${j[1]}`:""}`}>Book Now</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nRoute: ${name}\nPlease share availability and current fare.`)} target="_blank" rel="noreferrer">WhatsApp</a><a className="btn call" href={tel}>Call</a></div></div></div></Sec>
<Sec title="Available cars" alt><CarCards/></Sec><CTA/></>)}

export function GalleryPage(){useTitle("Our Fleet Gallery");return(<><Head title="Our Fleet Gallery" sub="Explore our dependable drop taxi fleet for one-way, airport, and outstation trips."/><Sec title="Cab photos" alt><GalleryGrid/></Sec><CTA/></>)}

export function About(){useTitle("About Us");return(<><Head title="About Epic Drop Taxi" sub="A Neyveli-based drop taxi service connecting Tamil Nadu, Puducherry, Bengaluru and Kerala."/>
<Sec><div className="two"><Img label="About us" src={IMG.about} className="h320"/><div><h2>Our story</h2><p>Epic Drop Taxi runs from Vadakuthu, Neyveli, serving Cuddalore and Villupuram districts and one way trips between cities across South India. We believe you should pay for the journey you take, with clear fares and a driver who shows up on time.</p><div className="stats dark">{[["5K+","Trips"],["100+","Routes"],["24/7","Support"],["4.9★","Rating"]].map(([a,b])=><div key={b}><b>{a}</b><span>{b}</span></div>)}</div></div></div></Sec>
<Sec title="Our promise" alt><div className="grid3">{[["Transparent pricing","Per-km fares and charges listed on the tariff page."],["Safe journeys","Verified drivers and well-maintained cabs."],["Always available","Call or WhatsApp us any time of day or night."]].map(([t,d])=><div className="card pad" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></Sec><CTA/></>)}

export function Tariff(){useTitle("Tariff");const [km,setKm]=useState(200);const [car,setCar]=useState("sedan");const c=cars.find(x=>x.id===car);const fare=Math.max(km,150)*c.one+bata[car];
return(<><Head title="One Way Taxi Fare & Tariff" sub="Toll, permit, parking, waiting, hill, pet and over-luggage charges are extra."/>
<Sec title="Quick fare estimate"><div className="qb inline"><select value={car} onChange={e=>setCar(e.target.value)}>{cars.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select><input type="number" min="1" value={km} onChange={e=>setKm(+e.target.value)}/><div className="est">≈ ₹{fare.toLocaleString("en-IN")}<small> (min 150 km + bata)</small></div></div></Sec>
<Sec title="Tariff tables" alt><div className="grid2">{tariff.map(([t,rows])=><div className="card" key={t}><h3 className="th">{t}</h3><table><tbody>{rows.map(([a,b])=><tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div>)}</div></Sec>
<Sec title="State wise permit charges"><table className="full"><thead><tr><th>State</th><th>6+1</th><th>7+1</th></tr></thead><tbody>{permits.map(([s,a,b])=><tr key={s}><td>{s}</td><td>₹{a}</td><td>₹{b}</td></tr>)}</tbody></table><p className="muted sm">Permit charges are collected as per state regulations and are extra on the trip fare.</p></Sec><CTA/></>)}

export function Services(){useTitle("Our Services");return(<><Head title="Our Services" sub="Everything you need for a smooth road trip."/>
<Sec><div className="grid3">{allServices.map(([t,p],i)=><Link to={p} className="card pad" key={t}><div className="big">{["🚕","✈️","🛣️","📍","⏱️","🛕"][i]}</div><h3>{t}</h3><p className="muted">Tap for details and tariff.</p></Link>)}</div></Sec><CTA/></>)}

export function Book(){useTitle("Book Now");const [q]=useSearchParams();
const [f,setF]=useState({type:"One Way",name:"",phone:"",from:q.get("from")||"",to:q.get("to")||"",date:"",time:"10:00",car:q.get("car")||"sedan",km:""});const s=k=>e=>setF({...f,[k]:e.target.value});
const c=cars.find(x=>x.id===f.car);const rate=f.type==="One Way"?c.one:c.round;const min=f.type==="One Way"?150:300;const est=f.km?Math.max(+f.km,min)*rate+bata[f.car]:null;
const send=e=>{e.preventDefault();window.open(wa(`*New Booking*\nName: ${f.name}\nPhone: ${f.phone}\nTrip: ${f.type}\nFrom: ${f.from}\nTo: ${f.to}\nDate: ${f.date} ${f.time}\nCar: ${c.name}${est?`\nApprox fare: ₹${est} (excl. toll/permit)`:""}`),"_blank")};
return(<><Head title="Book Your Ride" sub="Fill the form and send it on WhatsApp. We confirm the final fare before pickup."/>
<Sec><div className="two"><form className="qb big" onSubmit={send}>
<select value={f.type} onChange={s("type")}><option>One Way</option><option>Round Trip</option></select>
<input required placeholder="Your name" value={f.name} onChange={s("name")}/><input required type="tel" placeholder="Phone number" value={f.phone} onChange={s("phone")}/>
<input required placeholder="📍 Pickup" value={f.from} onChange={s("from")}/><input required placeholder="📍 Drop" value={f.to} onChange={s("to")}/>
<div className="row2"><input required type="date" value={f.date} onChange={s("date")}/><input type="time" value={f.time} onChange={s("time")}/></div>
<select value={f.car} onChange={s("car")}>{cars.map(x=><option key={x.id} value={x.id}>{x.name} ({x.seats})</option>)}</select>
<input type="number" placeholder="Approx distance in km (optional, for estimate)" value={f.km} onChange={s("km")}/>
{est&&<div className="est">≈ ₹{est.toLocaleString("en-IN")}<small> excl. toll, permit, parking</small></div>}
<button className="btn solid full">Send on WhatsApp</button></form>
<div><h2>Prefer to talk?</h2><p>Call us any time, day or night.</p><Actions/><p className="muted">📞 {SITE.display}<br/>✉️ {SITE.email}</p></div></div></Sec></>)}

export function Contact(){useTitle("Contact Us");return(<><Head title="Contact Us" sub="Call or WhatsApp for the fastest response."/>
<Sec><div className="grid3">{[["📞","Call",SITE.display,tel],["💬","WhatsApp","Chat with us",wa("Hello, I would like to know more.")],["✉️","Email",SITE.email,`mailto:${SITE.email}`]].map(([i,t,v,h])=><a className="card pad center" href={h} key={t} target="_blank" rel="noreferrer"><div className="big">{i}</div><h3>{t}</h3><p className="muted">{v}</p></a>)}</div>
<div className="two mt"><div><h2>Visit our office</h2><p>📍 {SITE.address}</p><p>🕒 Open 24/7</p><Actions/></div><iframe title="map" className="map" src={SITE.map} loading="lazy"/></div></Sec></>)}

export function Legal({k}){const t=k==="terms"?"Terms of Use":"Privacy Policy";useTitle(t);return(<><Head title={t}/><Sec><div className="legal">{k==="terms"?<><p>Fares shown are approximate and are confirmed on WhatsApp or phone before pickup. Toll, state permit, parking, waiting, hill, pet and over-luggage charges are extra unless stated.</p><p>Bookings may be rescheduled or cancelled by contacting us as early as possible. Drivers may refuse unsafe or unlawful requests.</p><p>Replace this placeholder text with your final legal terms.</p></>:<><p>We collect only the details you share (name, phone, trip details) to arrange your booking. We do not sell your data.</p><p>Details sent via WhatsApp are handled under WhatsApp's own privacy policy.</p><p>Replace this placeholder text with your final privacy policy.</p></>}</div></Sec></>)}
export const NotFound=()=><Sec title="Page not found"><Link className="btn solid" to="/">Go home</Link></Sec>;
