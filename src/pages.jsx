import {useEffect,useState} from "react";
import {Link,useParams,useSearchParams} from "react-router-dom";
import {SITE,IMG,wa,tel,cities,journeys,cars,bata,tariff,permits,reviews,faqs,services,allServices} from "./data";
import {Img,Head,Actions} from "./Layout";
const useTitle=t=>useEffect(()=>{document.title=`${t} | ${SITE.name}`},[t]);
const cap=s=>s.split("-").map(w=>w[0].toUpperCase()+w.slice(1)).join(" ");
const Sec=({title,tag,children,alt})=><section className={`sec ${alt?"alt":""}`}><div className="wrap">{tag&&<small className="tag">{tag}</small>}{title&&<h2>{title}</h2>}{children}</div></section>;
const CarCards=()=><div className="grid4">{cars.map(c=><div className="card" key={c.id}><Img label={c.name} className="h160"/><div className="pad"><h3>{c.name}</h3><p className="muted">{c.models} · {c.seats} seater · {c.bags} bags</p><p><b>One way ₹{c.one}/km</b><br/>Round trip ₹{c.round}/km</p><p className="muted sm">Min: 130 km one way · 250 km round trip (AC). Toll, parking, permit extra.</p><div className="actions"><Link className="btn solid" to={`/book?car=${c.id}`}>Book</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nCar: ${c.name}\nPlease share availability and booking details.`)} target="_blank" rel="noreferrer">WhatsApp</a></div></div></div>)}</div>;
const Reviews=()=><Sec title="What Our Riders Say" tag="4.9★ · Google Reviews" alt><div className="grid4">{reviews.map(([n,t])=><div className="card pad" key={n}><p>“{t}”</p><b>{n}</b><div className="muted sm">Google Review</div></div>)}</div><div className="actions center"><a className="btn solid" href={SITE.reviews} target="_blank" rel="noreferrer">Read reviews</a><a className="btn ghost" href={SITE.write} target="_blank" rel="noreferrer">Write a review</a></div></Sec>;
const Faq=()=><Sec title="One Way Taxi FAQs">{faqs.map(([q,a])=><details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}</Sec>;
const CTA=()=><section className="cta"><div className="wrap"><h2>Ready to book a one way taxi?</h2><p>Share your journey details to get a current quote and vehicle availability.</p><Actions/></div></section>;

export function Home(){useTitle("One Way Drop Taxi & Outstation Cabs in Tamil Nadu");return(<>
<section className="hero"><div className="wrap two"><div>
<small className="tag">Tamil Nadu · Puducherry · Bengaluru · Kerala</small>
<h1>One Way Drop Taxi & Outstation Cabs Across Tamil Nadu</h1>
<p>Safe, reliable and affordable. Professional drivers, transparent pricing, 24/7 support.</p>
<Actions/>
<div className="stats">{[["5K+","Trips Done"],["100+","Routes"],["24/7","Support"],["4.9★","Rating"]].map(([a,b])=><div key={b}><b>{a}</b><span>{b}</span></div>)}</div></div>
<QuickBook/></div></section>
<Sec title="Popular One Way Taxi Routes" tag="One Way Taxi Services"><div className="grid3">{cities.slice(0,12).map(([s,n,d])=><div className="card" key={s}><Img label={n} src={IMG.cities[s]} className="h160"/><div className="pad"><h3><Link to={`/routes/${s}`}>{n} Drop Taxi</Link></h3><p className="muted">{d}</p><div className="actions"><Link className="btn solid" to={`/book?from=${s}`}>Book Now</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nRoute: ${n} Drop Taxi\nPlease share availability and current fare.`)} target="_blank" rel="noreferrer">WhatsApp</a></div></div></div>)}</div><div className="actions center"><Link className="btn ghost" to="/routes">View all routes</Link></div></Sec>
<Sec title="One Way Taxi Service in Tamil Nadu" alt><div className="grid3">{Object.entries(services).map(([k,v])=><div className="card pad" key={k}><h3>{v.title}</h3><p className="muted">{v.intro}</p><Link to={`/${k}`}>Read more →</Link></div>)}</div><h4 className="mt">Popular journeys</h4><div className="chips">{journeys.map(j=><Link key={j} to={`/routes/${j}`}>{cap(j).replace(" To "," to ")}</Link>)}</div></Sec>
<Sec title="Drop Taxi from Neyveli, Cuddalore & Nearby Towns" tag="Our home base"><p className="lead">Based in Vadakuthu, Neyveli. Book from Neyveli, Vadalur, Panruti, Virudhachalam, Cuddalore, Chidambaram, Villupuram or Puducherry to any city and pay only for the journey you take.</p><p className="muted">நெய்வேலி, கடலூர், பண்ருட்டி, விருத்தாசலம், சிதம்பரம் பகுதிகளில் இருந்து சென்னை, புதுச்சேரி, பெங்களூரு, திருச்சி, மதுரை உட்பட எந்த ஊருக்கும் ஒன் வே டிராப் டாக்ஸி. நீங்கள் செல்லும் தூரத்துக்கு மட்டுமே கட்டணம். 24 மணி நேரமும் போன் / வாட்ஸ்அப் மூலம் புக் செய்யுங்கள்.</p></Sec>
<Sec title="Choose Your Car for a One Way Trip" tag="Available car types" alt><CarCards/></Sec>
<Sec title="Why Choose Epic Drop Taxi?"><div className="grid4">{[["💰","Pay for the trip you book","No billing for an empty return on one way drops."],["🧾","See your fare instantly","Approximate fare with breakdown, confirmed on WhatsApp."],["✅","Verified drivers","Professional drivers and well-maintained cabs."],["🕒","Book any time","Call, WhatsApp or booking form, 24/7."]].map(([i,t,d])=><div className="card pad" key={t}><div className="big">{i}</div><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></Sec>
<Reviews/><Faq/><CTA/></>)}

function QuickBook(){const [f,setF]=useState({type:"One Way",from:"",to:"",car:"sedan"});const s=k=>e=>setF({...f,[k]:e.target.value});
return <form className="qb" onSubmit={e=>{e.preventDefault();window.open(wa(`*New Booking Enquiry*\nTrip: ${f.type}\nFrom: ${f.from}\nTo: ${f.to}\nCar: ${f.car}`),"_blank")}}><h3>Book Your Ride</h3><p className="muted sm">Get instant fare. No hidden charges.</p>
<select value={f.type} onChange={s("type")}><option>One Way</option><option>Round Trip</option></select>
<input required placeholder="📍 Pickup city" value={f.from} onChange={s("from")}/><input required placeholder="📍 Drop city" value={f.to} onChange={s("to")}/>
<select value={f.car} onChange={s("car")}>{cars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
<button className="btn solid full">Book on WhatsApp</button><Link className="btn ghost full" to="/book">Full booking form</Link></form>}

export function Service({k}){const v=services[k];useTitle(v.title);return(<><Head title={v.title} sub={v.intro}/>
<Sec><div className="two"><Img label={v.title} src={IMG[v.img]} className="h320"/><div><h2>How it works</h2><ul className="ticks">{v.points.map(p=><li key={p}>{p}</li>)}</ul><ol className="steps"><li>Share pickup, drop, date and passengers</li><li>We confirm vehicle and fare</li><li>Driver arrives on time</li></ol><Actions msg={`Hello, I need ${v.title}.`}/></div></div></Sec>
<Sec title="Choose your car" alt><CarCards/></Sec><Faq/><CTA/></>)}

export function RoutesPage(){useTitle("One Way Taxi Routes");return(<><Head title="One Way Taxi Routes" sub="Pick your city for route details, or share your journey and we will confirm."/>
<Sec title="Popular journeys"><div className="chips">{journeys.map(j=><Link key={j} to={`/routes/${j}`}>{cap(j).replace(" To "," to ")}</Link>)}</div></Sec>
<Sec title="All cities" alt><div className="grid3">{cities.map(([s,n,d])=><Link to={`/routes/${s}`} className="card pad" key={s}><h3>{n} Drop Taxi</h3><p className="muted">{d}</p></Link>)}</div></Sec><CTA/></>)}

export function RouteDetail(){const {slug}=useParams();const c=cities.find(x=>x[0]===slug);
const j=slug.includes("-to-")?slug.split("-to-").map(cap):null;const name=j?`${j[0]} to ${j[1]}`:c?c[1]:cap(slug);const title=`${name} One Way Taxi`;useTitle(title);
return(<><Head title={title} sub={c?c[2]:"Share pickup, drop, date and passenger count and we will confirm the vehicle and fare before pickup."}/>
<Sec><div className="two"><Img label={name} src={c&&IMG.cities[c[0]]} className="h320"/><div><h2>Book a {name} cab</h2><p>Pay only for the journey you book. Fare is the per-km rate × distance (130 km minimum) plus driver bata. Toll, permit, parking, waiting and hill charges are extra.</p><ul className="ticks"><li>Sedan from ₹14/km</li><li>SUV / Innova from ₹19/km</li><li>Innova Crysta ₹21/km</li><li>24/7 pickups</li></ul><div className="actions"><Link className="btn solid" to={`/book?from=${j?j[0]:name}${j?`&to=${j[1]}`:""}`}>Book Now</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nRoute: ${name}\nPlease share availability and current fare.`)} target="_blank" rel="noreferrer">WhatsApp</a><a className="btn call" href={tel}>Call</a></div></div></div></Sec>
<Sec title="Available cars" alt><CarCards/></Sec><CTA/></>)}

export function About(){useTitle("About Us");return(<><Head title="About Epic Drop Taxi" sub="A Neyveli-based drop taxi service connecting Tamil Nadu, Puducherry, Bengaluru and Kerala."/>
<Sec><div className="two"><Img label="About us" src={IMG.about} className="h320"/><div><h2>Our story</h2><p>Epic Drop Taxi runs from Vadakuthu, Neyveli, serving Cuddalore and Villupuram districts and one way trips between cities across South India. We believe you should pay for the journey you take, with clear fares and a driver who shows up on time.</p><div className="stats dark">{[["5K+","Trips"],["100+","Routes"],["24/7","Support"],["4.9★","Rating"]].map(([a,b])=><div key={b}><b>{a}</b><span>{b}</span></div>)}</div></div></div></Sec>
<Sec title="Our promise" alt><div className="grid3">{[["Transparent pricing","Per-km fares and charges listed on the tariff page."],["Safe journeys","Verified drivers and well-maintained cabs."],["Always available","Call or WhatsApp us any time of day or night."]].map(([t,d])=><div className="card pad" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></Sec><CTA/></>)}

export function Tariff(){useTitle("Tariff");const [km,setKm]=useState(200);const [car,setCar]=useState("sedan");const c=cars.find(x=>x.id===car);const fare=Math.max(km,130)*c.one+bata[car];
return(<><Head title="One Way Taxi Fare & Tariff" sub="Toll, permit, parking, waiting, hill, pet and over-luggage charges are extra."/>
<Sec title="Quick fare estimate"><div className="qb inline"><select value={car} onChange={e=>setCar(e.target.value)}>{cars.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select><input type="number" min="1" value={km} onChange={e=>setKm(+e.target.value)}/><div className="est">≈ ₹{fare.toLocaleString("en-IN")}<small> (min 130 km + bata)</small></div></div></Sec>
<Sec title="Tariff tables" alt><div className="grid2">{tariff.map(([t,rows])=><div className="card" key={t}><h3 className="th">{t}</h3><table><tbody>{rows.map(([a,b])=><tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div>)}</div></Sec>
<Sec title="State wise permit charges"><table className="full"><thead><tr><th>State</th><th>6+1</th><th>7+1</th></tr></thead><tbody>{permits.map(([s,a,b])=><tr key={s}><td>{s}</td><td>₹{a}</td><td>₹{b}</td></tr>)}</tbody></table><p className="muted sm">Permit charges are collected as per state regulations and are extra on the trip fare.</p></Sec><CTA/></>)}

export function Services(){useTitle("Our Services");return(<><Head title="Our Services" sub="Everything you need for a smooth road trip."/>
<Sec><div className="grid3">{allServices.map(([t,p],i)=><Link to={p} className="card pad" key={t}><div className="big">{["🚕","✈️","🛣️","📍","⏱️","🛕"][i]}</div><h3>{t}</h3><p className="muted">Tap for details and tariff.</p></Link>)}</div></Sec><CTA/></>)}

export function Book(){useTitle("Book Now");const [q]=useSearchParams();
const [f,setF]=useState({type:"One Way",name:"",phone:"",from:q.get("from")||"",to:q.get("to")||"",date:"",time:"10:00",car:q.get("car")||"sedan",km:""});const s=k=>e=>setF({...f,[k]:e.target.value});
const c=cars.find(x=>x.id===f.car);const rate=f.type==="One Way"?c.one:c.round;const min=f.type==="One Way"?130:250;const est=f.km?Math.max(+f.km,min)*rate+bata[f.car]:null;
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
