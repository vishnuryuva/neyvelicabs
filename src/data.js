// ===== EDIT YOUR BUSINESS DETAILS HERE =====
export const SITE={name:"Epic Drop Taxi",phone:"919566227779",display:"+91 95662 27779",email:"epicdroptaxi@gmail.com",
address:"Flat No. 1, Ashok Nagar, Vadakuthu, Neyveli, Cuddalore District, Tamil Nadu",
instagram:"https://www.instagram.com/nfscabs2026",reviews:"https://maps.app.goo.gl/DMsuvWUT7mxQ4tYd9",write:"https://g.page/r/Cdla8uGVMJFWEAE/review",
map:"https://www.google.com/maps?q=Vadakuthu+Neyveli&output=embed"};
export const wa=t=>`https://wa.me/${SITE.phone}?text=${encodeURIComponent(t)}`;
export const tel=`tel:+${SITE.phone}`;
// ===== IMAGES: put files in /public/images and set paths here, e.g. hero:"/images/hero.jpg". Empty = dummy placeholder =====
export const IMG={hero:"",about:"",airport:"",outstation:"",oneway:"",contact:"",cities:{}};
export const cities=[
["chennai","Chennai","Capital of Tamil Nadu and the gateway to South India. Pickups from the city, airport and railway stations."],
["madurai","Madurai","Temple city of Meenakshi Amman. One-way and outstation cabs with fare confirmed before pickup."],
["coimbatore","Coimbatore","Textile and engineering hub and the gateway to the Nilgiris."],
["trichy","Trichy","Rockfort city on the Kaveri and a major travel junction."],
["bangalore","Bangalore","Karnataka's IT capital, a frequent start for one-way trips into Tamil Nadu."],
["pondicherry","Pondicherry","Seaside French quarter, Auroville and weekend getaways."],
["ooty","Ooty","Tea estates and cool Nilgiris climate. Hill charges apply."],
["kodaikanal","Kodaikanal","Palani Hills lake town. Share luggage details for the right vehicle."],
["karaikudi","Karaikudi","Heart of Chettinad with heritage mansions and cuisine."],
["rameshwaram","Rameshwaram","Ramanathaswamy Temple and a major pilgrimage stop."],
["salem","Salem","Steel and textile town and the gateway to Yercaud."],
["erode","Erode","Turmeric trading centre with steady business travel."],
["neyveli","Neyveli","Our home base: NLC township, Vadakuthu, Mandarakuppam and nearby areas."],
["kanyakumari","Kanyakumari","Southern tip of India where three seas meet."],
["thanjavur","Thanjavur","Chola capital with the UNESCO-listed Brihadeeswarar Temple."],
["velankanni","Velankanni","Coastal pilgrimage town around the Basilica of Our Lady of Good Health."],
["tirunelveli","Tirunelveli","Southern Tamil Nadu city on the Thamirabarani river."],
["kumbakonam","Kumbakonam","Temple town in the Kaveri delta, known for Mahamaham tank."],
["cuddalore","Cuddalore","About 40 km from our Neyveli office. Quick pickups in town and the SIPCOT belt."],
["chidambaram","Chidambaram","Nataraja temple pilgrims and Annamalai University students. No charge for the empty return."],
["panruti","Panruti","Right next to our Neyveli office, so pickups are fast at any hour."],
["virudhachalam","Virudhachalam","About 25 km from our office. Temple visits and railway connections."],
["vadalur","Vadalur","Minutes from our office. Vallalar Sathya Gnana Sabai devotees and families."],
["villupuram","Villupuram","Junction railway passengers and trips to Chennai, Puducherry and Trichy."],
["tiruvannamalai","Tiruvannamalai","Arunachaleswarar temple, Girivalam pilgrims and Ramana Ashram visitors."]];
export const journeys=["neyveli-to-chennai","chennai-to-madurai","neyveli-to-chennai-airport","chennai-to-coimbatore","neyveli-to-pondicherry","chennai-to-bangalore","neyveli-to-bangalore","chennai-to-pondicherry"];
export const cars=[
{id:"sedan",name:"Sedan",models:"Dzire / Etios",seats:"4+1",bags:2,one:14,round:13},
{id:"suv",name:"SUV",models:"Ertiga / Xylo",seats:"6+1",bags:4,one:19,round:18},
{id:"innova",name:"Innova",models:"Toyota Innova",seats:"7+1",bags:4,one:19,round:18},
{id:"innova-crysta",name:"Innova Crysta",models:"Premium MPV",seats:"7+1",bags:4,one:21,round:20}];
export const bata={sedan:400,suv:500,innova:500,"innova-crysta":500};
export const tariff=[
["One Way Drop – Sedan (Dzire / Etios)",[["Rate","Rs. 14 / km"],["Driver Bata","Rs. 400"],["Minimum Distance","130 kms"],["Permit (KA/AP/PY/KL/TN)","Rs. 500"],["Hill Charges","Rs. 300"],["Waiting","Rs. 150 / hr"],["Pet / Over Luggage","Rs. 300"]]],
["One Way Drop – SUV (Ertiga / Innova / Xylo)",[["Rate","Rs. 19 / km"],["Driver Bata","Rs. 500"],["Minimum Distance","130 kms"],["Permit KA / AP / PY / KL / TN","Rs. 1200 / 2500 / 1000 / 2500 / 1000"],["Hill Charges","Rs. 300"],["Waiting","Rs. 150 / hr"],["Pet / Over Luggage","Rs. 300"]]],
["Outstation Round Trip – Sedan",[["Rate","Rs. 13 / km"],["Driver Bata","Rs. 400"],["Minimum Usage","250 kms / day"],["Permit","Rs. 500"],["Hill / Pet / Luggage","Rs. 300 each"]]],
["Outstation Round Trip – SUV",[["Rate","Rs. 18 / km"],["Driver Bata","Rs. 500"],["Minimum Usage","250 kms / day"],["Permit","As applicable"],["Hill / Pet / Luggage","Rs. 300 each"]]],
["Local Pickup / Drop – Sedan",[["Package","Rs. 1200 for 40 kms"],["Extra KM","Rs. 25 / km"]]],
["Local Pickup / Drop – SUV",[["Package","Rs. 1600 for 40 kms"],["Extra KM","Rs. 35 / km"]]],
["Local Hourly – Sedan",[["Package","Rs. 2500 (8 hrs / 80 kms)"],["Extra Hour","Rs. 250 / hr"],["Extra KM","Rs. 25 / km"]]],
["Local Hourly – SUV",[["Package","Rs. 3300 (8 hrs / 80 kms)"],["Extra Hour","Rs. 350 / hr"],["Extra KM","Rs. 35 / km"]]]];
export const permits=[["KA",700,1000],["KL",1000,2500],["PY",850,850],["AP",750,2150]];
export const reviews=[["Guru","Had a good experience for an outstation one-way trip. The cab was clean and the driver drove safely."],["Keerthana M","I needed a one-way drop taxi. Very convenient service and the driver was punctual."],["Krishna Rock","Good and affordable service."],["Venkadesaperumal P","Good service for outstation one-way travel. Clean cab and a professional driver."],["Laksh","Booking was easy and the journey was comfortable."],["Rajaganapathy P","Excellent service! Polite driver, safe driving and reached on time."],["Sharmila V","Clean and comfortable car, punctual driver. Highly recommended."],["Ramya Raj","Clean vehicle, prompt pickup and transparent pricing. Would use again."]];
export const faqs=[
["Where is Epic Drop Taxi based?","We are based in Vadakuthu, Neyveli (Cuddalore district) and run one way taxis across Tamil Nadu, Puducherry, Bengaluru and Kerala."],
["Which cities can I book a one way taxi from?","Neyveli, Cuddalore, Chidambaram, Chennai, Madurai, Coimbatore, Trichy, Salem, Pondicherry, Ooty, Bangalore and many more. Share your pickup and drop and we confirm availability."],
["One way taxi vs round trip?","A one way taxi is billed for the single journey (130 km minimum). A round trip includes the return leg, billed per km with a 250 km per day minimum."],
["How is the fare calculated?","Per-km rate for your vehicle times the distance (130 km minimum) plus driver bata. Toll, permit, parking, waiting and hill charges are extra."],
["Can I see the fare before I book?","Yes. Use the booking page for an approximate fare, send it on WhatsApp and we confirm the final fare before pickup."],
["Can I book an airport pickup or drop?","Yes. Share flight or travel time, pickup point and passenger count."]];
export const services={
"one-way-drop-taxi":{title:"One Way Drop Taxi",img:"oneway",intro:"Pay only for the journey you book, not for an empty return trip. City-to-city drops across Tamil Nadu, Puducherry, Bengaluru and Kerala.",points:["130 km minimum distance","Sedan, SUV, Innova and Crysta","Fare confirmed before pickup","24/7 call and WhatsApp booking"]},
"airport-taxi":{title:"Airport Taxi",img:"airport",intro:"Confirmed pickup or drop for Chennai, Trichy, Madurai, Coimbatore and Bengaluru airports, timed to your flight.",points:["Flight-time based scheduling","Meet and greet on request","Luggage-friendly SUVs","Day and night service"]},
"outstation-taxi":{title:"Outstation Taxi",img:"outstation",intro:"Plan an intercity one-way or round-trip cab with the right vehicle for your group, family or business trip.",points:["Round trip from Rs. 13 / km","250 km per day minimum","Hill, temple and tourist circuits","Verified, experienced drivers"]}};
export const allServices=[["One Way Drop Taxi","/one-way-drop-taxi"],["Airport Taxi","/airport-taxi"],["Outstation Taxi","/outstation-taxi"],["Local Pickup & Drop","/tariff"],["Hourly Rental Packages","/tariff"],["Temple & Pilgrimage Tours","/outstation-taxi"]];
