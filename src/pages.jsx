import {useEffect,useId,useRef,useState} from "react";
import {Link,useParams,useSearchParams} from "react-router-dom";
import {SITE,IMG,wa,tel,cities,journeys,seoRoutes,cars,tariff,permits,reviews,faqs,services,allServices} from "./data";
import {Img,Head,Actions,LocalizedContent,useLanguage} from "./Layout";
import {translate} from "./i18n";
import {calculateFareQuote,getDrivingDistanceKm,searchLocations} from "./routing";
import {updateSeo} from "./seo";
const useTitle=(t,description,{noindex=false,pageSchema}={})=>{
  const {lang}=useLanguage();
  useEffect(() => {
    updateSeo({
      title: `${translate(lang,t)} | ${SITE.name}`,
      description: description || "Book a one-way drop taxi from Neyveli across Tamil Nadu and nearby states. 24/7 call and WhatsApp booking.",
      noindex,
      pageSchema,
      locale: lang === "ta" ? "ta_IN" : "en_IN"
    });
  }, [lang,t,description,noindex,pageSchema]);
};
const cap=s=>s.split("-").map(w=>w[0].toUpperCase()+w.slice(1)).join(" ");
const Sec=({title,tag,children,alt})=><section className={`sec ${alt?"alt":""}`}><div className="wrap">{tag&&<small className="tag">{tag}</small>}{title&&<h2>{title}</h2>}{children}</div></section>;
function LocationInput({value,onValueChange,placeholder,required=false}){
  const {lang}=useLanguage();
  const listId=useId();
  const [focused,setFocused]=useState(false);
  const [suggestions,setSuggestions]=useState([]);
  const [activeIndex,setActiveIndex]=useState(0);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const requestId=useRef(0);

  useEffect(()=>{
    const query=value.trim();
    const id=++requestId.current;
    if(!focused||query.length<3){
      setSuggestions([]);
      setLoading(false);
      setError("");
      return undefined;
    }

    const controller=new AbortController();
    setLoading(true);
    setError("");
    const timer=setTimeout(()=>{
      searchLocations(query,{signal:controller.signal})
        .then(results=>{
          if(id===requestId.current){
            setSuggestions(results);
            setActiveIndex(0);
            if(results.length===0)setError("No locations found. Try adding the city or state.");
          }
        })
        .catch(error=>{
          if(id===requestId.current&&error.name!=="AbortError"){
            setSuggestions([]);
            setError(error.message);
          }
        })
        .finally(()=>{
          if(id===requestId.current)setLoading(false);
        });
    },350);

    return ()=>{
      clearTimeout(timer);
      controller.abort();
      if(requestId.current===id)requestId.current+=1;
    };
  },[value,focused]);

  const selectSuggestion=suggestion=>{
    setSuggestions([]);
    setFocused(false);
    onValueChange(suggestion.label);
  };

  return <div className="location-field">
    <input
      type="text"
      required={required}
      placeholder={translate(lang,placeholder)}
      value={value}
      autoComplete="off"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={focused&&suggestions.length>0}
      aria-controls={listId}
      aria-activedescendant={focused&&suggestions[activeIndex]?`${listId}-${activeIndex}`:undefined}
      onFocus={()=>setFocused(true)}
      onBlur={()=>setFocused(false)}
      onChange={event=>onValueChange(event.target.value)}
      onKeyDown={event=>{
        if(event.key==="ArrowDown"&&suggestions.length){
          event.preventDefault();
          setActiveIndex(index=>(index+1)%suggestions.length);
        }else if(event.key==="ArrowUp"&&suggestions.length){
          event.preventDefault();
          setActiveIndex(index=>(index-1+suggestions.length)%suggestions.length);
        }else if(event.key==="Enter"&&suggestions[activeIndex]){
          event.preventDefault();
          selectSuggestion(suggestions[activeIndex]);
        }else if(event.key==="Escape"){
          setSuggestions([]);
          setFocused(false);
        }
      }}
    />
    {focused&&value.trim().length>=3&&(loading||error||suggestions.length>0)&&<div className="location-suggestions">
      {loading&&<p className="suggestion-status">{translate(lang,"Searching locations…")}</p>}
      {suggestions.length>0&&<div id={listId} role="listbox">{suggestions.map((suggestion,index)=><button id={`${listId}-${index}`} type="button" className={`location-suggestion${activeIndex===index?" active":""}`} role="option" aria-selected={activeIndex===index} key={`${suggestion.label}-${index}`} onMouseDown={event=>event.preventDefault()} onMouseEnter={()=>setActiveIndex(index)} onClick={()=>selectSuggestion(suggestion)}>{suggestion.label}</button>)}</div>}
      {error&&<p className="suggestion-status error" role="status">{translate(lang,error)}</p>}
    </div>}
  </div>;
}
function useRouteFare(){
  const [quote,setQuote]=useState(null);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const requestId=useRef(0);
  const reset=()=>{
    requestId.current+=1;
    setQuote(null);
    setError("");
    setLoading(false);
  };
  const calculate=async({from,to,tripType,car})=>{
    if(!from.trim()||!to.trim()){
      reset();
      setError("Enter both pickup and drop locations to calculate a fare.");
      return null;
    }
    const id=++requestId.current;
    setLoading(true);
    setQuote(null);
    setError("");
    try{
      const distanceKm=await getDrivingDistanceKm(from,to);
      if(id!==requestId.current)return null;
      const nextQuote=calculateFareQuote({distanceKm,tripType,car});
      setQuote(nextQuote);
      return nextQuote;
    }catch(error){
      if(id===requestId.current)setError(error.message);
      return null;
    }finally{
      if(id===requestId.current)setLoading(false);
    }
  };
  return {quote,error,loading,calculate,reset};
}
function FareQuote({quote,tripType}){
  if(!quote)return null;
  return <LocalizedContent><div className="fare-quote" aria-live="polite">
    <p><b>Driving distance (one way):</b> {quote.distanceKm.toFixed(1)} km</p>
    {tripType==="round-trip"&&<p><b>Estimated round-trip distance:</b> {quote.totalDistanceKm.toFixed(1)} km</p>}
    <p><b>Chargeable distance:</b> {quote.chargeableKm.toFixed(1)} km ({quote.minimumKm} km minimum)</p>
    <p><b>Rate:</b> ₹{quote.rate}/km · <b>Driver bata:</b> ₹{quote.driverBata}</p>
    <p className="est">Estimated fare: ₹{quote.fare.toLocaleString("en-IN")}</p>
    <p className="muted sm">Toll, permit, parking and other applicable charges are extra. This is an estimate; confirm the final fare with us.</p>
  </div></LocalizedContent>;
}
const RoutingAttribution=()=> <LocalizedContent><p className="muted sm routing-attribution">Search data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>. Suggestions powered by <a href="https://photon.komoot.io/" target="_blank" rel="noreferrer">Photon</a>. Routing by OSRM.</p></LocalizedContent>;
const CarCards=()=><LocalizedContent><div className="grid4">{cars.map(c=><div className="card" key={c.id}><Img label={c.name} src={IMG.cars?.[c.id]} className="h160"/><div className="pad"><h3>{c.name}</h3><p className="muted">{c.models} · {c.seats} seater · {c.bags} bags</p><p><b>₹{c.one}/km</b><br/>Driver Bata ₹{c.driverBata}<br/>Min {c.minimum} KM</p><p className="muted sm">One-way toll charges extra.</p><div className="actions"><Link className="btn solid" to={`/book?car=${c.id}`}>Book</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nCar: ${c.name}\nPlease share availability and booking details.`)} target="_blank" rel="noreferrer">WhatsApp</a></div></div></div>)}</div></LocalizedContent>;
const GalleryGrid=()=><LocalizedContent><div className="grid3">{IMG.gallery.map((url,i)=><div className="card" key={url+i}><img className="gallery-image" src={url} alt={`Epic Drop Taxi cab photo ${i+1}`} /></div>)}</div></LocalizedContent>;
const Reviews=()=><LocalizedContent><Sec title="What Our Riders Say" tag="4.9★ · Google Reviews" alt><div className="grid4">{reviews.map(([n,t])=><div className="card pad" key={n}><p>“{t}”</p><b>{n}</b><div className="muted sm">Google Review</div></div>)}</div><div className="actions center"><a className="btn solid" href={SITE.reviews} target="_blank" rel="noreferrer">Read reviews</a><a className="btn ghost" href={SITE.write} target="_blank" rel="noreferrer">Write a review</a></div></Sec></LocalizedContent>;
const Gallery=()=><LocalizedContent><Sec title="Our Fleet Gallery" tag="Cab photos" alt><GalleryGrid/></Sec></LocalizedContent>;
const Faq=()=><LocalizedContent><Sec title="One Way Taxi FAQs">{faqs.map(([q,a])=><details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}</Sec></LocalizedContent>;
const CTA=()=><LocalizedContent><section className="cta"><div className="wrap"><h2>Ready to book a one way taxi?</h2><p>Share your journey details to get a current quote and vehicle availability.</p><Actions/></div></section></LocalizedContent>;

function HeroVisual({pricingMode}){
  const display = [
    {label:"Mini", value: pricingMode === "one-way" ? 14 : 18},
    {label:"Sedan", value: pricingMode === "one-way" ? 15 : 14},
    {label:"SUV", value: pricingMode === "one-way" ? 20 : 19}
  ];
  return <LocalizedContent><div className="hero-visual"><div className="hero-image-wrap"><Img label="Epic Drop Taxi cab" src={IMG.oneway} className="hero-image" /></div><div className="price-strip">{display.map(item=><div className="price-pill" key={item.label}><strong>₹{item.value}/km</strong><span>{item.label}</span></div>)}</div></div></LocalizedContent>;
}

export function Home(){
  const {lang}=useLanguage();
  const [pricingMode,setPricingMode]=useState("one-way");
  const tripCopy = {
    "one-way": {label: lang === "en" ? "One Way" : "ஒன் வே", toll: lang === "en" ? "One-way toll charges" : "ஒன்-வேயில் டோல் கட்டணம்", note: lang === "en" ? "Single trip fare" : "ஒற்றை பயண விலை"},
    "round-trip": {label: lang === "en" ? "Round Trip" : "ரவுண்ட் டிரிப்", toll: lang === "en" ? "Return tolls and parking extra" : "மீண்டும் செல்லும் டோல் மற்றும் பார்க்கிங் கூடுதல்", note: lang === "en" ? "Back-and-forth fare" : "மறுபுறம் செல்லும் விலை"}
  };
  useTitle(
    lang === "en" ? "One Way Drop Taxi & Outstation Cabs in Tamil Nadu" : "தமிழ்நாட்டில் ஒன் வே டிராப் டாக்ஸி & அவுட்ஸ்டேஷன் கேப்ஸ்",
    lang === "en"
      ? "Book a one-way drop taxi from Neyveli across Tamil Nadu and nearby states. Compare vehicles, check fares and book by call or WhatsApp, 24/7."
      : "நெய்வேலியில் இருந்து தமிழ்நாடு மற்றும் அருகிலுள்ள மாநிலங்களுக்கு ஒன் வே டிராப் டாக்ஸி முன்பதிவு செய்யுங்கள். வாகனங்கள், கட்டணங்கள் மற்றும் 24/7 வாட்ஸ்அப் சேவை."
  );
  return(<LocalizedContent><>
<section className="hero"><div className="wrap two"><div>
<small className="tag">{lang === "en" ? "Tamil Nadu · Puducherry · Bengaluru · Kerala" : "தமிழ்நாடு · புதுச்சேரி · பெங்களூர் · கேரளம்"}</small>
<h1>{lang === "en" ? "One Way Drop Taxi & Outstation Cabs Across Tamil Nadu" : "தமிழ்நாடு முழுவதும் ஒன் வே டிராப் டாக்ஸி & அவுட்ஸ்டேஷன் கேப்ஸ்"}</h1>
<p>{lang === "en" ? "Safe, reliable and affordable. Professional drivers, transparent pricing, 24/7 support." : "பாதுகாப்பான, நம்பகமான மற்றும் மலிவு. தொழில்முறை ஓட்டுநர்கள், வெளிப்படையான விலை, 24/7 உதவி."}</p>
<Actions/>
<div className="stats">{[["5K+",lang === "en" ? "Trips Done" : "பயணங்கள்"],["100+",lang === "en" ? "Routes" : "ரூட்ஸ்"],["24/7",lang === "en" ? "Support" : "உதவி"],["4.9★",lang === "en" ? "Rating" : "மதிப்பீடு"]].map(([a,b])=><div key={b}><b>{a}</b><span>{b}</span></div>)}</div></div>
<div className="hero-side"><HeroVisual pricingMode={pricingMode}/><QuickBook/></div></div></section>
<Sec title={lang === "en" ? "One Way Taxi Pricing & Round Trip Fare Details" : "ஒன் வே டாக்ஸி விலை & ரவுண்ட் டிரிப் கட்டண விவரங்கள்"} tag={lang === "en" ? "Fixed fare • No hidden charges • Instant booking" : "நிலையான விலை • மறைக்கப்பட்ட கட்டணங்கள் இல்லை • உடனடி புக்"}><div className="pricing-toggle">{["one-way","round-trip"].map(mode=><button key={mode} type="button" aria-pressed={pricingMode===mode} className={pricingMode === mode ? "active" : ""} onClick={()=>setPricingMode(mode)}>{tripCopy[mode].label}</button>)}</div><div className="grid4 pricing-grid">{cars.map(c=><div className="card pricing-card" key={c.id}><Img label={c.name} src={IMG.cars?.[c.id]} className="h160"/><div className="pad"><h3>{c.name}</h3><p className="big-price">₹{pricingMode === "one-way" ? c.one : c.round}/KM</p><p className="muted"><small>{tripCopy[pricingMode].note}</small></p><p className="muted">{lang === "en" ? "Driver Bata" : "டிரைவர் பாத்தா"} ₹{c.driverBata}</p><p className="muted">{lang === "en" ? "Min" : "குறைந்தபட்சம்"} {pricingMode === "one-way" ? c.minimum : 300} {lang === "en" ? "KM" : "கிமீ"}</p><p className="muted sm">{tripCopy[pricingMode].toll}</p><Link className="btn solid" to={`/book?car=${c.id}`}>{lang === "en" ? "Book Now" : "இப்போது புக்"}</Link></div></div>)}</div></Sec>
<Sec title={lang === "en" ? "Popular One Way Taxi Routes" : "பிரபலமான ஒன் வே டாக்ஸி ரூட்ஸ்"} tag={lang === "en" ? "One Way Taxi Services" : "ஒன் வே டாக்ஸி சேவைகள்"}><div className="city-strip">{cities.slice(0,12).map(([s,n,d])=><div className="card city-card" key={s}><Img label={n} src={IMG.cities[s]} className="h160 city-image"/><div className="pad"><h3><Link to={`/routes/${s}`}>{n} Drop Taxi</Link></h3><p className="muted">{d}</p><div className="actions"><Link className="btn solid" to={`/book?from=${s}`}>{lang === "en" ? "Book Now" : "இப்போது புக்"}</Link><a className="btn wa" href={wa(`*New Customer Enquiry*\nRoute: ${n} Drop Taxi\nPlease share availability and current fare.`)} target="_blank" rel="noreferrer">WhatsApp</a></div></div></div>)}</div><div className="actions center"><Link className="btn ghost" to="/routes">{lang === "en" ? "View all routes" : "அனைத்து ரூட்ஸையும் பார்க்க"}</Link></div></Sec>
<Sec title={lang === "en" ? "One Way Taxi Service in Tamil Nadu" : "தமிழ்நாட்டில் ஒன் வே டாக்ஸி சேவை"} alt><div className="grid3">{Object.entries(services).map(([k,v])=><div className="card pad" key={k}><h3>{v.title}</h3><p className="muted">{v.intro}</p><Link to={`/${k}`}>{lang === "en" ? "Read more" : "மேலும் படிக்க"} →</Link></div>)}</div><h4 className="mt">{lang === "en" ? "Popular journeys" : "பிரபலமான பயணங்கள்"}</h4><div className="chips">{journeys.map(j=><Link key={j} to={`/routes/${j}`}>{cap(j).replace(" To "," to ")}</Link>)}</div></Sec>
<Sec title={lang === "en" ? "Drop Taxi from Neyveli, Cuddalore & Nearby Towns" : "நெய்வேலி, கடலூர் & அருகிலுள்ள நகரங்களிலிருந்து டிராப் டாக்ஸி"} tag={lang === "en" ? "Our home base" : "எங்கள் வீட்டு தளம்"}><p className="lead">{lang === "en" ? "Based in Vadakuthu, Neyveli. Book from Neyveli, Vadalur, Panruti, Virudhachalam, Cuddalore, Chidambaram, Villupuram or Puducherry to any city and pay only for the journey you take." : "வாடாகுத்து, நெய்வேலியில் அமைந்துள்ளது. நெய்வேலி, வடலூர், பண்ருட்டி, விருத்தாசலம், கடலூர், சிதம்பரம், விழுப்புரம் அல்லது புதுச்சேரி ஆகிய இடங்களிலிருந்து எந்த நகருக்கும் புக் செய்து, நீங்கள் பயணிக்கும் தூரத்திற்கே பணம் செலுத்துங்கள்."}</p><p className="muted">{lang === "en" ? "We also serve outstation rides from Neyveli to Chennai, Puducherry, Bengaluru, Trichy and Madurai with transparent, pay-by-distance pricing across every journey." : "நெய்வேலி முதல் சென்னை, புதுச்சேரி, பெங்களூர், திருச்சி, மதுரை வரை வெளிநகர பயணங்களை வெளிப்படையான தூர அடிப்படையிலான விலையில் வழங்குகிறோம்."}</p></Sec>
<Gallery/>
<Sec title={lang === "en" ? "Why Choose Epic Drop Taxi?" : "ஏன் எபிக் டிராப் டாக்ஸியை தேர்வு செய்ய வேண்டும்?"}><div className="grid4">{[["💰",lang === "en" ? "Pay for the trip you book" : "நீங்கள் புக் செய்த பயணத்திற்கே பணம்","No billing for an empty return on one way drops."],["🧾",lang === "en" ? "See your fare instantly" : "விலையை உடனே பார்க்கவும்","Approximate fare with breakdown, confirmed on WhatsApp."],["✅",lang === "en" ? "Verified drivers" : "சரிபார்க்கப்பட்ட ஓட்டுநர்கள்","Professional drivers and well-maintained cabs."],["🕒",lang === "en" ? "Book any time" : "எப்போது வேண்டுமானாலும் புக்","Call, WhatsApp or booking form, 24/7."]].map(([i,t,d])=><div className="card pad" key={t}><div className="big">{i}</div><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></Sec>
<Reviews/><Faq/><CTA/></></LocalizedContent>) }

function QuickBook(){
  const {lang}=useLanguage();
  const [f,setF]=useState({type:"one-way",from:"",to:"",car:"sedan"});
  const {quote,error,loading,calculate,reset}=useRouteFare();
  const s=k=>e=>{setF({...f,[k]:e.target.value});reset();};
  return <LocalizedContent><form className="qb" onSubmit={e=>{e.preventDefault();window.open(wa(`*New Booking Enquiry*\nTrip: ${f.type==="one-way"?"One Way":"Round Trip"}\nFrom: ${f.from}\nTo: ${f.to}\nCar: ${cars.find(car=>car.id===f.car).name}`),"_blank")}}>
    <h3>{lang === "en" ? "Book Your Ride" : "உங்கள் சவாரியை புக் செய்யுங்கள்"}</h3>
    <p className="muted sm">{lang === "en" ? "Get instant fare. No hidden charges." : "உடனடி விலை. மறைக்கப்பட்ட கட்டணங்கள் இல்லை."}</p>
    <select value={f.type} onChange={s("type")}><option value="one-way">{lang === "en" ? "One Way" : "ஒன் வே"}</option><option value="round-trip">{lang === "en" ? "Round Trip" : "ரவுண்ட் டிரிப்"}</option></select>
    <LocationInput required placeholder="📍 Pickup city" value={f.from} onValueChange={value=>{setF({...f,from:value});reset();}}/>
    <LocationInput required placeholder="📍 Drop city" value={f.to} onValueChange={value=>{setF({...f,to:value});reset();}}/>
    <select value={f.car} onChange={s("car")}>{cars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <button type="button" className="btn ghost full" disabled={loading} onClick={()=>calculate({from:f.from,to:f.to,tripType:f.type,car:cars.find(car=>car.id===f.car)})}>{loading?"Calculating…":"Calculate distance & fare"}</button>
    {error&&<p className="error" role="alert">{error}</p>}
    <FareQuote quote={quote} tripType={f.type}/><RoutingAttribution/>
    <button className="btn solid full">{lang === "en" ? "Book on WhatsApp" : "வாட்ஸ்அப்பில் புக்"}</button>
    <Link className="btn ghost full" to="/book">{lang === "en" ? "Full booking form" : "முழு புக் பக்கம்"}</Link>
  </form></LocalizedContent>;
}

export function Service({k}){const v=services[k];useTitle(v.title,v.description,{pageSchema:{"@type":"Service",name:v.title,description:v.description,serviceType:v.title,provider:{"@id":`${SITE.url}/#business`},areaServed:["Neyveli","Tamil Nadu","Puducherry","Bengaluru","Kerala"]}});return(<LocalizedContent><>
<section className={`service-hero service-hero-${k}`}><div className="wrap service-hero-layout">
<div className="service-hero-copy"><span className="service-eyebrow">24/7 DROP TAXI · TAMIL NADU</span><h1>{v.title}</h1><p>{v.intro}</p><Actions msg={`Hello, I need ${v.title}.`}/><div className="service-trust"><span>✓ Clear fares</span><span>✓ Reliable pickups</span><span>✓ Comfortable rides</span></div></div>
<div className="service-hero-visual"><div className="service-image-frame"><Img label={v.title} src={IMG[v.img]} className="service-hero-image"/></div><div className="service-image-note"><span className="service-note-icon">✦</span><span><b>{v.title}</b><small>Travel comfortably, every time</small></span></div><div className="service-orbit" aria-hidden="true"/></div>
</div></section>
<Sec><div className="service-details"><div className="service-process"><small className="tag">SIMPLE & CONVENIENT</small><h2>How it works</h2><ol className="steps"><li>Share pickup, drop, date and passengers</li><li>We confirm vehicle and fare</li><li>Driver arrives on time</li></ol></div><div className="service-highlights"><h3>Made for your journey</h3><ul className="ticks">{v.points.map(p=><li key={p}>{p}</li>)}</ul></div></div></Sec>
<Sec title="Choose your car" alt><CarCards/></Sec><Faq/><CTA/></></LocalizedContent>)}

export function RoutesPage(){
const {lang}=useLanguage();
useTitle(
  lang==="en"?"Taxi Routes & Airport Transfers":"டாக்ஸி வழித்தடங்கள் மற்றும் விமான நிலையப் பயணங்கள்",
  lang==="en"
    ?"Explore one-way taxi routes from Neyveli and across Tamil Nadu, with estimated fares, vehicle options and direct WhatsApp booking."
    :"நெய்வேலி மற்றும் தமிழ்நாடு முழுவதும் ஒன் வே டாக்ஸி வழித்தடங்கள், தோராயக் கட்டணம், வாகனத் தேர்வுகள் மற்றும் வாட்ஸ்அப் முன்பதிவு."
);
return(<LocalizedContent><><Head title={lang==="en"?"One Way Taxi Routes & Airport Cabs":"ஒன் வே டாக்ஸி வழித்தடங்கள் மற்றும் விமான நிலைய கேப்கள்"} sub={lang==="en"?"Explore route-wise one-way taxi and airport transfer pages with estimated fares, vehicle options and direct WhatsApp booking.":"வழித்தட வாரியான ஒன் வே டாக்ஸி மற்றும் விமான நிலையப் பயணங்களுக்கான தோராயக் கட்டணம், வாகனங்கள் மற்றும் வாட்ஸ்அப் முன்பதிவைப் பாருங்கள்."}/>
<Sec title={lang==="en"?"Popular routes & airport taxis":"பிரபலமான வழித்தடங்கள் மற்றும் விமான நிலைய டாக்ஸிகள்"}><div className="grid3">{seoRoutes.map(route=><Link to={`/routes/${route.slug}`} className="card pad route-list-card" key={route.slug}><small className="tag">{route.airport?(lang==="en"?"Airport Taxi":"விமான நிலைய டாக்ஸி"):(lang==="en"?"One Way Drop":"ஒன் வே டிராப்")}</small><h3>{lang==="en"?`${route.from} to ${route.to}`:`${route.fromTa} முதல் ${route.toTa} வரை`}</h3><p className="muted">{lang==="en"?"Fare estimate, available cars and booking details":"கட்டண மதிப்பீடு, வாகனங்கள் மற்றும் முன்பதிவு விவரங்கள்"}</p><span>{lang==="en"?"View route & fare →":"வழித்தடம் மற்றும் கட்டணத்தைப் பார்க்க →"}</span></Link>)}</div></Sec>
<Sec title={lang==="en"?"Taxi service by city":"நகர வாரியான டாக்ஸி சேவை"} alt><div className="grid3">{cities.map(([s,n,d])=><Link to={`/routes/${s}`} className="card pad" key={s}><h3>{lang==="en"?`${n} Drop Taxi`:`${translate("ta",n)} டிராப் டாக்ஸி`}</h3><p className="muted">{d}</p></Link>)}</div></Sec><CTA/></></LocalizedContent>)
}

export function RouteDetail(){
const {slug}=useParams();
const {lang}=useLanguage();
const route=seoRoutes.find(item=>item.slug===slug);
const city=cities.find(item=>item[0]===slug);
const routeFrom=route?(lang==="en"?route.from:route.fromTa):"";
const routeTo=route?(lang==="en"?route.to:route.toTa):"";
const routeName=route?`${routeFrom} ${lang==="en"?"to":"முதல்"} ${routeTo}`:"";
const cityName=city?(lang==="en"?city[1]:translate("ta",city[1])):cap(slug);
const title=route
 ?(route.localAirport?(lang==="en"?"Coimbatore Airport Taxi":"கோயம்புத்தூர் விமான நிலைய டாக்ஸி"):(lang==="en"?`${route.from} to ${route.to} ${route.airport?"Taxi":"One Way Taxi"}`:`${routeFrom} முதல் ${routeTo} ${route.airport?"டாக்ஸி":"ஒன் வே டாக்ஸி"}`))
 :(lang==="en"?`${cityName} Drop Taxi`:`${cityName} டிராப் டாக்ஸி`);
const cityDescription=city?translate(lang,city[2]):(lang==="en"?"Share your pickup, destination and travel date for a confirmed quote.":"உறுதியான கட்டணத்திற்கு பிக்கப் இடம், சேருமிடம் மற்றும் பயணத் தேதியைப் பகிருங்கள்.");
const description=route
 ?(lang==="en"?`Book a ${route.from} to ${route.to} ${route.airport?"taxi":"one way taxi"} with Mini, Sedan, SUV and Innova options. Estimated fare details and WhatsApp booking.`:`${routeFrom} முதல் ${routeTo} வரை ${route.airport?"டாக்ஸி":"ஒன் வே டாக்ஸி"} முன்பதிவு. மினி, செடான், SUV மற்றும் இன்னோவா வாகனங்கள்; கட்டண விவரம் மற்றும் வாட்ஸ்அப் முன்பதிவு.`)
 :(lang==="en"?`Book a drop taxi in ${cityName}. Explore one-way fares, Mini, Sedan, SUV and Innova vehicles, and book on WhatsApp.`:`${cityName} டிராப் டாக்ஸி. ஒன் வே கட்டணம், மினி, செடான், SUV, இன்னோவா வாகனங்கள் மற்றும் வாட்ஸ்அப் முன்பதிவு.`);
const pageSchema={
  "@type":"Service",
  name:title,
  description,
  serviceType:route?(route.airport?"Airport taxi":"One-way taxi"):"Drop taxi",
  provider:{"@id":`${SITE.url}/#business`},
  areaServed:route?[route.from,route.to]:cityName
};
useTitle(title,description,{pageSchema:(route||city)?pageSchema:undefined,noindex:!route&&!city});
const chargeableKm=route?Math.max(route.distanceKm,route.localAirport?0:150):150;
const fareMin=route?(route.localAirport?1200:Math.round(chargeableKm*14+400)):null;
const fareMax=route?(route.localAirport?1600:Math.round(chargeableKm*26+500)):null;
const bookFrom=route?route.from:city?city[1]:cityName;
const bookTo=route?route.to:"";
const whatsappName=route?routeName:cityName;
const whatsappBookingMessage=lang==="en"
 ?`*New Customer Enquiry*\nRoute: ${whatsappName}\nPlease confirm availability and the current fare.`
 :`*புதிய வாடிக்கையாளர் விசாரணை*\nவழித்தடம்: ${whatsappName}\nவாகனக் கிடைக்கும் நிலை மற்றும் தற்போதைய கட்டணத்தை உறுதிப்படுத்துங்கள்.`;
const whatsappDetailsMessage=lang==="en"
 ?`*New Customer Enquiry*\nRoute: ${whatsappName}\nPlease share pickup point, travel date and passenger count.`
 :`*புதிய வாடிக்கையாளர் விசாரணை*\nவழித்தடம்: ${whatsappName}\nபிக்கப் இடம், பயணத் தேதி மற்றும் பயணிகள் எண்ணிக்கையைப் பகிருங்கள்.`;
const imageKey=city?.[0]||(route?.from.toLowerCase().replaceAll(" ","")||"");
const imageSrc=IMG.cities[imageKey]||IMG.cities[route?.to.toLowerCase().replaceAll(" ","")];
const fareText=route?(route.localAirport
 ?(lang==="en"?"Approx. ₹1,200–₹1,600 for local drop packages up to 40 km.":"40 கி.மீ. வரையிலான உள்ளூர் டிராப் பேக்கேஜ் தோராயமாக ₹1,200–₹1,600.")
 :(lang==="en"?`Approx. ₹${fareMin.toLocaleString("en-IN")}–₹${fareMax.toLocaleString("en-IN")} one way, based on ${route.distanceKm} km estimated distance.`:`ஒரு வழிப் பயணத்திற்கு தோராயமாக ₹${fareMin.toLocaleString("en-IN")}–₹${fareMax.toLocaleString("en-IN")}; ${route.distanceKm} கி.மீ. மதிப்பிடப்பட்ட தூரத்தின் அடிப்படையில்.`))
 :(lang==="en"?"Indicative one-way minimum fare: ₹2,500–₹4,400 for 150 km, based on Mini to premium vehicle rates; driver bata is included.":"தோராய ஒன் வே குறைந்தபட்சக் கட்டணம்: 150 கி.மீ.க்கு மினி முதல் பிரீமியம் வாகனம் வரை ₹2,500–₹4,400; ஓட்டுநர் படி இதில் சேர்க்கப்பட்டுள்ளது.");
return(<LocalizedContent><>
<Head title={title} sub={route?(lang==="en"?`One-way cab from ${route.from} to ${route.to}. Compare vehicle options, check an estimated fare range and book directly on WhatsApp.`:`${routeFrom} முதல் ${routeTo} வரை ஒன் வே கேப். வாகனங்களை ஒப்பிட்டு, தோராயக் கட்டணத்தைப் பார்த்து, வாட்ஸ்அப்பில் முன்பதிவு செய்யுங்கள்.`):cityDescription}/>
<Sec><div className="two"><Img label={routeName||cityName} src={imageSrc} className="h320 city-image"/><div>
<small className="tag">{route?.airport?(lang==="en"?"AIRPORT TAXI":"விமான நிலைய டாக்ஸி"):(lang==="en"?"ONE WAY DROP TAXI":"ஒன் வே டிராப் டாக்ஸி")}</small>
<h2>{route?(lang==="en"?`Book a ${route.from} to ${route.to} cab`:`${routeFrom} முதல் ${routeTo} வரை கேப் முன்பதிவு`):(lang==="en"?`Book a ${cityName} cab`:`${cityName} கேப் முன்பதிவு`)}</h2>
<p className="route-fare-range">{fareText}</p>
<p>{route?(lang==="en"?`Plan a comfortable ${route.airport?"airport transfer":"one-way trip"} from ${route.from} to ${route.to}. The distance shown is an estimate; confirm the route and final fare with us before pickup.`:`${routeFrom} முதல் ${routeTo} வரை வசதியான ${route.airport?"விமான நிலையப் பயணத்தை":"ஒன் வே பயணத்தை"} திட்டமிடுங்கள். காட்டப்பட்ட தூரம் தோராயமானது; பிக்கப்புக்கு முன் பாதை மற்றும் இறுதிக் கட்டணத்தை உறுதிப்படுத்துங்கள்.`):(lang==="en"?`${cityDescription} Choose a one-way drop, airport transfer or outstation trip with a fare confirmed before pickup.`:`${cityDescription} ஒன் வே டிராப், விமான நிலையம் அல்லது வெளியூர் பயணத்தைத் தேர்வு செய்து, பிக்கப்புக்கு முன் கட்டணத்தை உறுதிப்படுத்துங்கள்.`)}</p>
<ul className="ticks">
<li>{lang==="en"?"Mini from ₹14/km · Sedan from ₹15/km":"மினி ₹14/கி.மீ. முதல் · செடான் ₹15/கி.மீ. முதல்"}</li>
<li>{lang==="en"?"SUV / Innova from ₹20/km; premium MPVs available":"SUV / இன்னோவா ₹20/கி.மீ. முதல்; பிரீமியம் MPV-களும் உண்டு"}</li>
<li>{lang==="en"?"150 km minimum for intercity one-way trips":"நகரங்களுக்கு இடையிலான ஒன் வே பயணங்களுக்கு குறைந்தபட்சம் 150 கி.மீ."}</li>
<li>{lang==="en"?"Toll, permit, parking and applicable extras are additional":"சுங்கம், அனுமதி, பார்க்கிங் மற்றும் பொருந்தும் கூடுதல் கட்டணங்கள் தனி"}</li>
<li>{lang==="en"?"24/7 pickup coordination and WhatsApp booking":"24/7 பிக்கப் ஒருங்கிணைப்பு மற்றும் வாட்ஸ்அப் முன்பதிவு"}</li>
</ul>
<div className="actions"><Link className="btn solid" to={`/book?from=${encodeURIComponent(bookFrom)}${bookTo?`&to=${encodeURIComponent(bookTo)}`:""}`}>{lang==="en"?"Book this trip":"இந்தப் பயணத்தை முன்பதிவு"}</Link><a className="btn wa" href={wa(whatsappBookingMessage)} target="_blank" rel="noreferrer">{lang==="en"?"Book on WhatsApp":"வாட்ஸ்அப்பில் முன்பதிவு"}</a><a className="btn call" href={tel}>{lang==="en"?"Call":"அழைக்க"}</a></div>
</div></div></Sec>
<Sec title={lang==="en"?"Fare range & vehicle options":"கட்டண வரம்பு மற்றும் வாகனத் தேர்வுகள்"} alt>
<p>{route?(route.localAirport?(lang==="en"?"Coimbatore local drop tariff: Sedan ₹1,200 (40 km) and SUV ₹1,600 (40 km). Extra distance is charged separately.":"கோயம்புத்தூர் உள்ளூர் டிராப் கட்டணம்: செடான் ₹1,200 (40 கி.மீ.), SUV ₹1,600 (40 கி.மீ.). கூடுதல் தூரத்திற்கு தனிக் கட்டணம்."):(lang==="en"?`The estimated ${route.distanceKm} km route uses the published one-way rates and 150 km minimum: ₹14–₹26/km plus ₹400–₹500 driver bata. The fare range above is indicative, not a fixed quote.`:`மதிப்பிடப்பட்ட ${route.distanceKm} கி.மீ. வழித்தடத்திற்கு வெளியிடப்பட்ட ஒன் வே கட்டணங்களும் 150 கி.மீ. குறைந்தபட்சமும் பொருந்தும்: ₹14–₹26/கி.மீ. மற்றும் ₹400–₹500 ஓட்டுநர் படி. மேலுள்ள கட்டண வரம்பு தோராயமானது; உறுதியான விலை அல்ல.`)):(lang==="en"?"One-way fares start at ₹14/km for Mini, ₹15/km for Sedan, and ₹20/km for SUV and Innova. Minimum chargeable distance is 150 km; driver bata and applicable extras are additional.":"ஒன் வே கட்டணம் மினிக்கு ₹14/கி.மீ., செடானுக்கு ₹15/கி.மீ., SUV மற்றும் இன்னோவாவுக்கு ₹20/கி.மீ. முதல். குறைந்தபட்ச கட்டணத் தூரம் 150 கி.மீ.; ஓட்டுநர் படி மற்றும் பொருந்தும் கூடுதல் கட்டணங்கள் தனி.")}</p>
<p className="muted sm">{lang==="en"?"Route distance and fares are estimates only. Confirm vehicle availability, exact distance and final fare with Epic Drop Taxi before booking.":"வழித்தூரமும் கட்டணமும் தோராயமானவை. முன்பதிவுக்கு முன் வாகனக் கிடைக்கும் நிலை, துல்லியமான தூரம் மற்றும் இறுதிக் கட்டணத்தை எபிக் டிராப் டாக்ஸியிடம் உறுதிப்படுத்துங்கள்."}</p>
<CarCards/>
</Sec>
<Sec title={lang==="en"?"Book your cab in English or Tamil":"ஆங்கிலம் அல்லது தமிழில் கேப் முன்பதிவு செய்யுங்கள்"}>
<p>{lang==="en"?`For ${routeName||cityName} taxi booking, send your pickup point, travel date, passenger count and preferred vehicle on WhatsApp. We will confirm availability and the applicable fare.`:`${routeName||cityName} கேப் முன்பதிவுக்கு பிக்கப் இடம், பயணத் தேதி, பயணிகள் எண்ணிக்கை மற்றும் விரும்பும் வாகனத்தை வாட்ஸ்அப்பில் அனுப்புங்கள். வாகனக் கிடைக்கும் நிலை மற்றும் பொருந்தும் கட்டணத்தை உறுதிப்படுத்துகிறோம்.`}</p>
<div className="actions"><a className="btn wa" href={wa(whatsappDetailsMessage)} target="_blank" rel="noreferrer">{lang==="en"?"Chat on WhatsApp":"வாட்ஸ்அப்பில் உரையாடுங்கள்"}</a><Link className="btn ghost" to="/tariff">{lang==="en"?"View full tariff":"முழு கட்டண விவரத்தைப் பார்க்க"}</Link></div>
</Sec>
<CTA/></></LocalizedContent>)
}

export function GalleryPage(){useTitle("Our Fleet Gallery","View Epic Drop Taxi's fleet photos and explore vehicles available for one-way, airport and outstation trips from Neyveli.");return(<LocalizedContent><><Head title="Our Fleet Gallery" sub="Explore our dependable drop taxi fleet for one-way, airport, and outstation trips."/><Sec title="Cab photos" alt><GalleryGrid/></Sec><CTA/></></LocalizedContent>)}
export function About(){useTitle("About Us","Learn about Epic Drop Taxi, a Neyveli-based taxi service offering one-way, airport and outstation trips across Tamil Nadu and nearby states.");return(<LocalizedContent><><Head title="About Epic Drop Taxi" sub="A Neyveli-based drop taxi service connecting Tamil Nadu, Puducherry, Bengaluru and Kerala."/>
<Sec><div className="two"><Img label="About us" src={IMG.about} className="h320"/><div><h2>Our story</h2><p>Epic Drop Taxi runs from Vadakuthu, Neyveli, serving Cuddalore and Villupuram districts and one way trips between cities across South India. We believe you should pay for the journey you take, with clear fares and a driver who shows up on time.</p><div className="stats dark">{[["5K+","Trips"],["100+","Routes"],["24/7","Support"],["4.9★","Rating"]].map(([a,b])=><div key={b}><b>{a}</b><span>{b}</span></div>)}</div></div></div></Sec>
<Sec title="Our promise" alt><div className="grid3">{[["Transparent pricing","Per-km fares and charges listed on the tariff page."],["Safe journeys","Verified drivers and well-maintained cabs."],["Always available","Call or WhatsApp us any time of day or night."]].map(([t,d])=><div className="card pad" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></Sec><CTA/></></LocalizedContent>)}

export function Tariff(){
  useTitle("Tariff","Compare Epic Drop Taxi one-way, round-trip, airport and local taxi fares from Neyveli. Tolls, permits and applicable extra charges are listed.");
  const [f,setF]=useState({from:"",to:"",type:"one-way",car:"sedan"});
  const {quote,error,loading,calculate,reset}=useRouteFare();
  const s=k=>e=>{setF({...f,[k]:e.target.value});reset();};
  return(<LocalizedContent><><Head title="One Way Taxi Fare & Tariff" sub="Toll, permit, parking, waiting, hill, pet and over-luggage charges are extra."/>
<Sec title="Quick fare estimate"><div className="qb inline">
  <LocationInput required placeholder="📍 Pickup city" value={f.from} onValueChange={value=>{setF({...f,from:value});reset();}}/>
  <LocationInput required placeholder="📍 Drop city" value={f.to} onValueChange={value=>{setF({...f,to:value});reset();}}/>
  <select value={f.type} onChange={s("type")}><option value="one-way">One Way</option><option value="round-trip">Round Trip</option></select>
  <select value={f.car} onChange={s("car")}>{cars.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
  <button type="button" className="btn solid" disabled={loading} onClick={()=>calculate({from:f.from,to:f.to,tripType:f.type,car:cars.find(x=>x.id===f.car)})}>{loading?"Calculating…":"Calculate fare"}</button>
  {error&&<p className="error" role="alert">{error}</p>}
  <FareQuote quote={quote} tripType={f.type}/><RoutingAttribution/>
</div></Sec>
<Sec title="Tariff tables" alt><div className="grid2">{tariff.map(([t,rows])=><div className="card" key={t}><h3 className="th">{t}</h3><table><tbody>{rows.map(([a,b])=><tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div>)}</div></Sec>
<Sec title="State wise permit charges"><table className="full"><thead><tr><th>State</th><th>6+1</th><th>7+1</th></tr></thead><tbody>{permits.map(([s,a,b])=><tr key={s}><td>{s}</td><td>₹{a}</td><td>₹{b}</td></tr>)}</tbody></table><p className="muted sm">Permit charges are collected as per state regulations and are extra on the trip fare.</p></Sec><CTA/></></LocalizedContent>)}

export function Services(){useTitle("Our Services","Explore one-way drop taxi, airport transfer and outstation cab services from Neyveli with 24/7 booking.");return(<LocalizedContent><><Head title="Our Services" sub="Everything you need for a smooth road trip."/>
<Sec><div className="grid3">{allServices.map(([t,p],i)=><Link to={p} className="card pad" key={t}><div className="big">{["🚕","✈️","🛣️","📍","⏱️","🛕"][i]}</div><h3>{t}</h3><p className="muted">Tap for details and tariff.</p></Link>)}</div></Sec><CTA/></></LocalizedContent>)}

export function Book(){useTitle("Book Now","Send your Neyveli taxi booking details to Epic Drop Taxi on WhatsApp for availability and fare confirmation.",{noindex:true});const [q]=useSearchParams();
const [f,setF]=useState({type:"one-way",name:"",phone:"",from:q.get("from")||"",to:q.get("to")||"",date:"",time:"10:00",car:q.get("car")||"sedan"});
const {quote,error,loading,calculate,reset}=useRouteFare();
const s=k=>e=>{setF({...f,[k]:e.target.value});if(k==="from"||k==="to"||k==="car"||k==="type")reset();};
const c=cars.find(x=>x.id===f.car);
const send=e=>{e.preventDefault();window.open(wa(`*New Booking*\nName: ${f.name}\nPhone: ${f.phone}\nTrip: ${f.type==="one-way"?"One Way":"Round Trip"}\nFrom: ${f.from}\nTo: ${f.to}\nDate: ${f.date} ${f.time}\nCar: ${c.name}${quote?`\nDriving distance: ${quote.distanceKm.toFixed(1)} km one way\nChargeable distance: ${quote.chargeableKm.toFixed(1)} km\nApprox fare: ₹${quote.fare} (toll/permit extra)`:""}`),"_blank")};
return(<LocalizedContent><><Head title="Book Your Ride" sub="Fill the form and send it on WhatsApp. We confirm the final fare before pickup."/>
<Sec><div className="two"><form className="qb big" onSubmit={send}>
<select value={f.type} onChange={s("type")}><option value="one-way">One Way</option><option value="round-trip">Round Trip</option></select>
<input required placeholder="Your name" value={f.name} onChange={s("name")}/><input required type="tel" placeholder="Phone number" value={f.phone} onChange={s("phone")}/>
<LocationInput required placeholder="📍 Pickup" value={f.from} onValueChange={value=>{setF({...f,from:value});reset();}}/><LocationInput required placeholder="📍 Drop" value={f.to} onValueChange={value=>{setF({...f,to:value});reset();}}/>
<div className="row2"><input required type="date" value={f.date} onChange={s("date")}/><input type="time" value={f.time} onChange={s("time")}/></div>
<select value={f.car} onChange={s("car")}>{cars.map(x=><option key={x.id} value={x.id}>{x.name} ({x.seats})</option>)}</select>
<button type="button" className="btn ghost full" disabled={loading} onClick={()=>calculate({from:f.from,to:f.to,tripType:f.type,car:c})}>{loading?"Calculating…":"Calculate distance & fare"}</button>
{error&&<p className="error" role="alert">{error}</p>}
<FareQuote quote={quote} tripType={f.type}/><RoutingAttribution/>
<button className="btn solid full">Send on WhatsApp</button></form>
<div><h2>Prefer to talk?</h2><p>Call us any time, day or night.</p><Actions/><p className="muted">📞 {SITE.display}<br/>✉️ {SITE.email}</p></div></div></Sec></></LocalizedContent>)}

export function Contact(){useTitle("Contact Us","Call or WhatsApp Epic Drop Taxi in Neyveli for 24/7 one-way, airport and outstation taxi bookings.");return(<LocalizedContent><><Head title="Contact Us" sub="Call or WhatsApp for the fastest response."/>
<Sec><div className="grid3">{[["📞","Call",SITE.display,tel],["💬","WhatsApp","Chat with us",wa("Hello, I would like to know more.")],["✉️","Email",SITE.email,`mailto:${SITE.email}`]].map(([i,t,v,h])=><a className="card pad center" href={h} key={t} target="_blank" rel="noreferrer"><div className="big">{i}</div><h3>{t}</h3><p className="muted">{v}</p></a>)}</div>
<div className="two mt"><div><h2>Visit our office</h2><p>📍 {SITE.address}</p><p>🕒 Open 24/7</p><Actions/></div><iframe title="map" className="map" src={SITE.map} loading="lazy"/></div></Sec></></LocalizedContent>)}

export function Legal({k}){const t=k==="terms"?"Terms of Use":"Privacy Policy";useTitle(t,`${t} for Epic Drop Taxi.`,{noindex:true});return(<LocalizedContent><><Head title={t}/><Sec><div className="legal">{k==="terms"?<><p>Fares shown are approximate and are confirmed on WhatsApp or phone before pickup. Toll, state permit, parking, waiting, hill, pet and over-luggage charges are extra unless stated.</p><p>Bookings may be rescheduled or cancelled by contacting us as early as possible. Drivers may refuse unsafe or unlawful requests.</p><p>Replace this placeholder text with your final legal terms.</p></>:<><p>We collect only the details you share (name, phone, trip details) to arrange your booking. We do not sell your data.</p><p>Details sent via WhatsApp are handled under WhatsApp's own privacy policy.</p><p>Replace this placeholder text with your final privacy policy.</p></>}</div></Sec></></LocalizedContent>)}
export const NotFound=()=>{useTitle("Page not found","The page you requested could not be found.",{noindex:true});return <LocalizedContent><Sec title="Page not found"><Link className="btn solid" to="/">Go home</Link></Sec></LocalizedContent>};
