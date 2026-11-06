import {useEffect} from "react";
import {HashRouter,Routes,Route,useLocation} from "react-router-dom";
import Layout from "./Layout";
import * as P from "./pages";
const Top=()=>{const {pathname}=useLocation();useEffect(()=>window.scrollTo(0,0),[pathname]);return null};
export default function App(){return(<HashRouter><Top/><Layout><Routes>
<Route path="/" element={<P.Home/>}/>
<Route path="/one-way-drop-taxi" element={<P.Service k="one-way-drop-taxi"/>}/>
<Route path="/airport-taxi" element={<P.Service k="airport-taxi"/>}/>
<Route path="/outstation-taxi" element={<P.Service k="outstation-taxi"/>}/>
<Route path="/routes" element={<P.RoutesPage/>}/>
<Route path="/routes/:slug" element={<P.RouteDetail/>}/>
<Route path="/about" element={<P.About/>}/>
<Route path="/tariff" element={<P.Tariff/>}/>
<Route path="/service" element={<P.Services/>}/>
<Route path="/book" element={<P.Book/>}/>
<Route path="/contact" element={<P.Contact/>}/>
<Route path="/terms" element={<P.Legal k="terms"/>}/>
<Route path="/privacy" element={<P.Legal k="privacy"/>}/>
<Route path="*" element={<P.NotFound/>}/>
</Routes></Layout></HashRouter>)}
