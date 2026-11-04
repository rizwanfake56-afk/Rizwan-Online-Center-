import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Menu, X, ArrowUpRight, FileText, CreditCard, Smartphone, Printer, ShieldCheck, Clock3, CheckCircle2, Headphones, ChevronRight, ClipboardList, UserRound, LayoutDashboard, Wallet, Settings, Plus, Filter, Download, MessageCircle, MapPin, Phone, Mail, Landmark, GraduationCap, BriefcaseBusiness, Zap, Upload, CircleHelp, Loader2, AlertCircle } from 'lucide-react';
import './style.css';
import { supabase, generateTrackingId } from './src/supabaseClient.js';

const services = [
  {id:1, category:'Documents', title:'PAN Card सहायता', desc:'नए PAN या सुधार के आवेदन में सहायता', icon:CreditCard, price:'₹99 से', tag:'लोकप्रिय'},
  {id:2, category:'Certificates', title:'आय प्रमाण पत्र', desc:'आवेदन भरने और दस्तावेज़ चेक करने में सहायता', icon:FileText, price:'₹50 से', tag:''},
  {id:3, category:'Certificates', title:'जाति प्रमाण पत्र', desc:'पात्रता और आवेदन प्रक्रिया की जानकारी', icon:ShieldCheck, price:'₹50 से', tag:''},
  {id:4, category:'Certificates', title:'निवास प्रमाण पत्र', desc:'निवास प्रमाण पत्र आवेदन सहायता', icon:Landmark, price:'₹50 से', tag:''},
  {id:5, category:'Utility', title:'बिजली बिल सहायता', desc:'बिल की जानकारी और भुगतान सहायता', icon:Zap, price:'बिल के अनुसार', tag:''},
  {id:6, category:'Utility', title:'मोबाइल रिचार्ज', desc:'प्रीपेड मोबाइल रिचार्ज सहायता', icon:Smartphone, price:'प्लान के अनुसार', tag:''},
  {id:7, category:'Forms', title:'सरकारी नौकरी फॉर्म', desc:'फॉर्म भरने और दस्तावेज़ अपलोड में सहायता', icon:BriefcaseBusiness, price:'₹100 से', tag:'लोकप्रिय'},
  {id:8, category:'Forms', title:'स्कॉलरशिप फॉर्म', desc:'छात्रवृत्ति आवेदन में सहायता', icon:GraduationCap, price:'₹100 से', tag:''},
  {id:9, category:'Documents', title:'प्रिंट / PDF / स्कैन', desc:'डॉक्यूमेंट प्रिंट और डिजिटल फाइल सहायता', icon:Printer, price:'₹5 से', tag:''},
  {id:10, category:'Documents', title:'फोटो और डॉक्यूमेंट', desc:'फोटो साइज़, PDF और दस्तावेज़ तैयार करना', icon:Upload, price:'₹20 से', tag:''},
  {id:11, category:'Forms', title:'सरकारी योजना जानकारी', desc:'योजना की पात्रता और आधिकारिक लिंक सहायता', icon:Landmark, price:'निःशुल्क जानकारी', tag:''},
  {id:12, category:'Other', title:'अन्य ऑनलाइन फॉर्म', desc:'अपनी जरूरत बताएं, हम सहायता करेंगे', icon:ClipboardList, price:'सेवा के अनुसार', tag:''},
];
const categories = ['सभी सेवाएँ','Documents','Certificates','Forms','Utility','Other'];
const categoryHindi = {Documents:'डॉक्यूमेंट',Certificates:'प्रमाण पत्र',Forms:'ऑनलाइन फॉर्म',Utility:'बिल / रिचार्ज',Other:'अन्य सेवाएँ'};
function App(){
  const [page,setPage]=useState('home');
  const [query,setQuery]=useState('');
  const [cat,setCat]=useState('सभी सेवाएँ');
  const [mobileMenu,setMobileMenu]=useState(false);
  const [selected,setSelected]=useState(null);
  const [form,setForm]=useState({name:'',phone:'',service:'PAN Card सहायता',message:''});
  const [submitState,setSubmitState]=useState('idle'); // idle | submitting | success | error
  const [submittedOrder,setSubmittedOrder]=useState(null);
  const [submitError,setSubmitError]=useState('');
  const [admin,setAdmin]=useState(false);
  const filtered=useMemo(()=>services.filter(s=>(cat==='सभी सेवाएँ'||s.category===cat)&&`${s.title} ${s.desc} ${s.category}`.toLowerCase().includes(query.toLowerCase())),[cat,query]);
  const openService=(s)=>{setSelected(s);setForm(f=>({...f,service:s.title}));setSubmitState('idle');setPage('request');window.scrollTo(0,0)};
  const submit=async (e)=>{
    e.preventDefault();
    setSubmitState('submitting');
    setSubmitError('');
    const trackingId = generateTrackingId();
    const payload = {
      tracking_id: trackingId,
      name: form.name.trim(),
      phone: form.phone.trim(),
      service: form.service,
      message: form.message.trim() || null,
      status: 'प्राप्त हुआ',
    };
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert(payload)
        .select('tracking_id, name, phone, service, message, status, created_at')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('रिक्वेस्ट सेव नहीं हुई। कृपया पुनः प्रयास करें।');
      setSubmittedOrder({
        ...data,
        date: new Date(data.created_at).toLocaleDateString('hi-IN'),
      });
      setSubmitState('success');
    } catch (err) {
      setSubmitError(err.message || 'कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।');
      setSubmitState('error');
    }
  };
  const go=(p)=>{setPage(p);setMobileMenu(false);window.scrollTo(0,0)};
  const waText = submittedOrder
    ? encodeURIComponent(`नमस्ते Rizwan Online Center, मेरी रिक्वेस्ट दर्ज हो गई है।\nट्रैकिंग आईडी: ${submittedOrder.tracking_id}\nसेवा: ${submittedOrder.service}\nनाम: ${submittedOrder.name}\nमोबाइल: ${submittedOrder.phone}${submittedOrder.message ? `\nविवरण: ${submittedOrder.message}` : ''}`)
    : encodeURIComponent(`नमस्ते Rizwan Online Center, मुझे ${form.service} के लिए सहायता चाहिए। नाम: ${form.name}, मोबाइल: ${form.phone}, विवरण: ${form.message}`);
  const whatsappUrl=`https://wa.me/?text=${waText}`;
  return <div className="app">
    <div className="topline"><div className="wrap topinner"><span><MapPin size={14}/> ऑनलाइन सेवाएँ, आसान प्रक्रिया</span><span className="topright"><Clock3 size={14}/> सहायता के लिए संपर्क करें</span></div></div>
    <header className="header"><div className="wrap nav">
      <button className="brand" onClick={()=>go('home')} aria-label="Home"><span className="brandmark"><Landmark size={25}/></span><span><b>Rizwan <em>Online Center</em></b><small>आपकी डिजिटल सेवा, आपके साथ</small></span></button>
      <nav className={mobileMenu?'navlinks show':'navlinks'}><button className={page==='home'?'active':''} onClick={()=>go('home')}>होम</button><button onClick={()=>go('services')}>सभी सेवाएँ</button><button onClick={()=>go('track')}>आवेदन ट्रैक करें</button><button onClick={()=>go('about')}>हमारे बारे में</button><button className="mobile-contact" onClick={()=>go('request')}>संपर्क करें</button></nav>
      <div className="navactions"><button className="outline-btn" onClick={()=>go('track')}><ClipboardList size={16}/> आवेदन ट्रैक करें</button><button className="menu-btn" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X/>:<Menu/>}</button></div>
    </div></header>
    {page==='home'&&<><main>
      <section className="hero"><div className="hero-pattern"></div><div className="wrap hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="dot"></span> भरोसेमंद डिजिटल सेवा सहायता</div><h1>आपके सभी ऑनलाइन काम,<br/><span>अब आसान तरीके से।</span></h1><p>ऑनलाइन फॉर्म, डॉक्यूमेंट, प्रमाण पत्र और डिजिटल सेवाओं के लिए सरल सहायता — एक ही जगह।</p><div className="hero-buttons"><button className="primary-btn" onClick={()=>go('services')}>सेवाएँ देखें <ArrowUpRight size={18}/></button><button className="secondary-btn" onClick={()=>go('request')}><MessageCircle size={17}/> सहायता लें</button></div><div className="trust-row"><span><CheckCircle2/> आसान प्रक्रिया</span><span><CheckCircle2/> स्पष्ट शुल्क</span><span><CheckCircle2/> व्यक्तिगत सहायता</span></div></div>
      <div className="hero-art"><div className="orbit orbit1"></div><div className="orbit orbit2"></div><div className="float-card card-top"><span className="float-icon green"><FileText/></span><span><b>ऑनलाइन फॉर्म</b><small>आवेदन सहायता</small></span><CheckCircle2 className="check"/></div><div className="phone-mock"><div className="phone-speaker"></div><div className="phone-screen"><div className="phone-logo"><Landmark/><b>ROC</b></div><div className="phone-greet">नमस्ते! 👋<small>आज किस सेवा में मदद चाहिए?</small></div><div className="mini-service-grid"><div><FileText/><small>फॉर्म</small></div><div><CreditCard/><small>PAN Card</small></div><div><Zap/><small>बिल</small></div><div><Printer/><small>प्रिंट</small></div></div><div className="phone-line"></div><div className="phone-line short"></div><div className="phone-cta">सेवा चुनें <ChevronRight size={13}/></div></div></div><div className="float-card card-bottom"><span className="float-icon orange"><ShieldCheck/></span><span><b>सुरक्षित सहायता</b><small>आपकी सुविधा प्राथमिकता</small></span></div><div className="hero-spark">✦</div></div></div></section>
      <section className="stats"><div className="wrap stats-grid"><div><span className="stat-icon"><FileText/></span><b>ऑनलाइन फॉर्म</b><small>फॉर्म भरने में सहायता</small></div><div><span className="stat-icon"><ShieldCheck/></span><b>दस्तावेज़ सहायता</b><small>डॉक्यूमेंट चेकलिस्ट</small></div><div><span className="stat-icon"><CreditCard/></span><b>डिजिटल सेवाएँ</b><small>एक जगह कई विकल्प</small></div><div><span className="stat-icon"><Headphones/></span><b>व्यक्तिगत सहायता</b><small>आपकी जरूरत के अनुसार</small></div></div></section>
      <section className="section"><div className="wrap"><div className="section-head"><div><span className="kicker">हमारी सेवाएँ</span><h2>आपको किस सेवा की जरूरत है?</h2><p>अपनी जरूरत की सेवा चुनें और रिक्वेस्ट भेजें।</p></div><button className="text-btn" onClick={()=>go('services')}>सभी सेवाएँ देखें <ArrowUpRight size={16}/></button></div><div className="service-grid">{services.slice(0,6).map(s=><ServiceCard key={s.id} s={s} onClick={()=>openService(s)}/>)}</div></div></section>
      <section className="cta-band"><div className="wrap cta-inner"><div className="cta-icon"><Headphones/></div><div><h2>समझ नहीं आ रहा कौन-सी सेवा चुनें?</h2><p>अपनी जरूरत बताइए — हम आपको सही प्रक्रिया समझने में मदद करेंगे।</p></div><button className="white-btn" onClick={()=>go('request')}>रिक्वेस्ट भेजें <ArrowUpRight size={17}/></button></div></section>
      <section className="section how"><div className="wrap"><div className="section-head center"><div><span className="kicker">कैसे काम करता है</span><h2>सिर्फ 3 आसान स्टेप</h2><p>शुरुआत से रिक्वेस्ट तक — आसान अनुभव।</p></div></div><div className="steps"><div className="step"><span>01</span><h3>सेवा चुनें</h3><p>लिस्ट में से अपनी जरूरत के अनुसार सेवा चुनें।</p></div><div className="step"><span>02</span><h3>जानकारी भरें</h3><p>अपना नाम और संपर्क विवरण देकर रिक्वेस्ट भेजें।</p></div><div className="step"><span>03</span><h3>आगे की सहायता</h3><p>रिक्वेस्ट विवरण WhatsApp पर भेजकर संपर्क करें।</p></div></div></div></section>
    </main></>}
    {page==='services'&&<main className="page-main"><div className="wrap"><div className="page-heading"><span className="kicker">सेवा कैटलॉग</span><h1>सभी ऑनलाइन सेवाएँ</h1><p>अपनी जरूरत की सेवा खोजें और सहायता रिक्वेस्ट भेजें।</p></div><div className="filters"><div className="searchbox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="सेवा खोजें जैसे PAN, स्कॉलरशिप..."/></div><div className="category-tabs">{categories.map(c=><button className={cat===c?'selected':''} key={c} onClick={()=>setCat(c)}>{c==='सभी सेवाएँ'?c:categoryHindi[c]}</button>)}</div></div><div className="service-grid">{filtered.map(s=><ServiceCard key={s.id} s={s} onClick={()=>openService(s)}/>)}</div>{filtered.length===0&&<div className="empty">कोई सेवा नहीं मिली। दूसरा शब्द खोजें।</div>}</div></main>}
    {page==='request'&&<main className="page-main"><div className="wrap request-layout"><div className="request-info"><span className="kicker">संपर्क और सहायता</span><h1>अपनी रिक्वेस्ट भेजें</h1><p>नीचे विवरण भरें। रिक्वेस्ट सुरक्षित रूप से सेव हो जाएगी और आपको एक ट्रैकिंग आईडी मिलेगी जिससे आप बाद में अपनी रिक्वेस्ट की स्थिति देख सकते हैं।</p><div className="contact-lines"><div><span><Phone/></span><div><b>फोन / WhatsApp</b><small>अपना बिज़नेस नंबर जोड़ें</small></div></div><div><span><Mail/></span><div><b>ईमेल</b><small>अपना ईमेल एड्रेस जोड़ें</small></div></div><div><span><MapPin/></span><div><b>सेवा क्षेत्र</b><small>अपने सेंटर का पता जोड़ें</small></div></div></div><div className="privacy-note"><ShieldCheck/><span>कृपया यहाँ Aadhaar नंबर, OTP, बैंक पासवर्ड या अन्य संवेदनशील जानकारी न भरें।</span></div></div><div className="form-card">{submitState==='success'&&submittedOrder?<div className="success-state"><span><CheckCircle2/></span><h2>रिक्वेस्ट दर्ज हो गई!</h2><p>आपकी रिक्वेस्ट सुरक्षित रूप से सेव हो गई है। नीचे दी गई ट्रैकिंग आईडी से आप बाद में अपनी रिक्वेस्ट की स्थिति देख सकते हैं। इसे सुरक्षित रखें।</p><div className="tracking-id-box"><ClipboardList size={18}/><div><small>आपकी ट्रैकिंग आईडी</small><b>{submittedOrder.tracking_id}</b></div></div><div className="success-actions"><a className="primary-btn link-btn" href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp पर भेजें <ArrowUpRight size={17}/></a><button className="secondary-btn" onClick={()=>{setSubmittedOrder(null);setSubmitState('idle');go('track')}}>ट्रैकिंग पेज पर जाएं</button></div></div>:<form onSubmit={submit}><h2>रिक्वेस्ट विवरण</h2><p className="form-sub">* जरूरी जानकारी भरें</p><label>पूरा नाम *<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="अपना नाम लिखें" disabled={submitState==='submitting'}/></label><label>मोबाइल नंबर *<input required pattern="[0-9]{10}" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,'').slice(0,10)})} placeholder="10 अंकों का मोबाइल नंबर" inputMode="numeric" disabled={submitState==='submitting'}/></label><label>कौन-सी सेवा चाहिए? *<select required value={form.service} onChange={e=>setForm({...form,service:e.target.value})} disabled={submitState==='submitting'}>{services.map(s=><option key={s.id}>{s.title}</option>)}</select></label><label>अतिरिक्त जानकारी<textarea rows="3" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="अपनी जरूरत संक्षेप में बताएं (OTP या संवेदनशील जानकारी न लिखें)" disabled={submitState==='submitting'}/></label>{submitState==='error'&&<div className="form-error"><AlertCircle size={16}/><span>{submitError}</span></div>}<button className="primary-btn submit-btn" type="submit" disabled={submitState==='submitting'}>{submitState==='submitting'?<><Loader2 size={17} className="spin"/> रिक्वेस्ट भेजी जा रही है...</>:<>रिक्वेस्ट भेजें <ArrowUpRight size={17}/></>}</button><small className="form-foot">रिक्वेस्ट सुरक्षित डेटाबेस में सेव होगी। आपको एक ट्रैकिंग आईडी मिलेगी।</small></form>}</div></div></main>}
    {page==='track'&&<TrackPage go={go}/>}
    {page==='about'&&<main className="page-main"><div className="wrap about-page"><span className="kicker">हमारे बारे में</span><h1>Rizwan Online Center</h1><p className="about-lead">आपके डिजिटल कामों को सरल बनाने का एक प्रयास।</p><div className="about-cards"><div><ShieldCheck/><h3>साफ जानकारी</h3><p>सेवा, प्रक्रिया और संभावित शुल्क को स्पष्ट रखने का लक्ष्य।</p></div><div><UserRound/><h3>ग्राहक सहायता</h3><p>आपकी जरूरत के अनुसार आवेदन प्रक्रिया समझने में मदद।</p></div><div><Landmark/><h3>जिम्मेदार सेवा</h3><p>सरकारी स्वीकृति या प्रमाण पत्र जारी करने का दावा नहीं; अंतिम निर्णय संबंधित विभाग का होता है।</p></div></div><div className="notice-box"><CircleHelp/><p><b>महत्वपूर्ण:</b> यह स्वतंत्र सेवा-सहायता डेमो है, आधिकारिक सरकारी पोर्टल नहीं। सरकारी आवेदन केवल संबंधित आधिकारिक वेबसाइट पर ही जमा करें।</p></div></div></main>}
    <footer><div className="wrap footer-main"><div className="footer-brand"><div className="brandmark"><Landmark/></div><div><b>Rizwan Online Center</b><p>आपकी डिजिटल सेवा, आपके साथ।</p></div></div><div className="footer-links"><button onClick={()=>go('services')}>सेवाएँ</button><button onClick={()=>go('request')}>संपर्क</button><button onClick={()=>go('about')}>हमारे बारे में</button></div><button className="admin-link" onClick={()=>setAdmin(!admin)}><Settings size={14}/> {admin?'Admin बंद करें':'Admin डेमो'}</button></div>{admin&&<div className="wrap admin-demo"><h3><LayoutDashboard size={18}/> Admin डेमो पैनल</h3><p>यह केवल फ्रंटएंड प्रीव्यू है। असली एडमिन लॉगिन, डेटाबेस और सुरक्षित एक्सेस अभी सेटअप नहीं हैं।</p><div className="admin-stats"><span><b>सुरक्षित</b><small>डेटाबेस स्टोरेज</small></span><span><b>{services.length}</b><small>सेवाएँ</small></span><span><b>Live</b><small>सिस्टम स्टेटस</small></span></div><button className="secondary-btn" onClick={()=>go('track')}>रिक्वेस्ट ट्रैक करें</button></div>}<div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Rizwan Online Center</span><span>यह डेमो वेबसाइट है · आधिकारिक सरकारी पोर्टल नहीं</span></div></footer>
  </div>
}

function TrackPage({go}){
  const [trackingId,setTrackingId]=useState('');
  const [searchState,setSearchState]=useState('idle'); // idle | searching | found | notfound | error
  const [result,setResult]=useState(null);
  const [errMsg,setErrMsg]=useState('');
  const lookup=async (e)=>{
    e.preventDefault();
    const id=trackingId.trim().toUpperCase();
    if(!id){return;}
    setSearchState('searching');
    setResult(null);
    setErrMsg('');
    try{
      const {data,error}=await supabase
        .from('requests')
        .select('tracking_id, name, phone, service, message, status, created_at')
        .eq('tracking_id',id)
        .maybeSingle();
      if(error) throw error;
      if(!data){
        setSearchState('notfound');
        return;
      }
      setResult({...data, date:new Date(data.created_at).toLocaleDateString('hi-IN')});
      setSearchState('found');
    }catch(err){
      setErrMsg(err.message||'खोज में समस्या हुई। पुनः प्रयास करें।');
      setSearchState('error');
    }
  };
  return <main className="page-main"><div className="wrap narrow"><div className="page-heading"><span className="kicker">रिक्वेस्ट मैनेजमेंट</span><h1>आवेदन / रिक्वेस्ट ट्रैक करें</h1><p>अपनी ट्रैकिंग आईडी डालें और रिक्वेस्ट की वर्तमान स्थिति देखें।</p></div>
    <form className="track-form" onSubmit={lookup}><div className="searchbox track-searchbox"><Search/><input value={trackingId} onChange={e=>setTrackingId(e.target.value.toUpperCase())} placeholder="ट्रैकिंग आईडी डालें (जैसे ROC1234567)" disabled={searchState==='searching'}/></div><button className="primary-btn track-btn" type="submit" disabled={searchState==='searching'}>{searchState==='searching'?<><Loader2 size={17} className="spin"/> खोज जारी...</>:<>स्थिति देखें <ArrowUpRight size={16}/></>}</button></form>
    {searchState==='notfound'&&<div className="track-result notfound"><AlertCircle className="ic"/><div><h3>कोई रिक्वेस्ट नहीं मिली</h3><p>इस ट्रैकिंग आईडी से कोई रिक्वेस्ट नहीं मिली। आईडी जाँचकर पुनः प्रयास करें।</p></div></div>}
    {searchState==='error'&&<div className="track-result notfound"><AlertCircle className="ic"/><div><h3>समस्या हुई</h3><p>{errMsg}</p></div></div>}
    {searchState==='found'&&result&&<div className="track-result found">
      <div className="track-result-head"><span className="track-status-badge"><CheckCircle2 size={15}/> {result.status}</span><code>{result.tracking_id}</code></div>
      <div className="track-detail-grid"><div className="track-detail"><small>सेवा</small><b>{result.service}</b></div><div className="track-detail"><small>नाम</small><b>{result.name}</b></div><div className="track-detail"><small>मोबाइल</small><b>{result.phone}</b></div><div className="track-detail"><small>दिनांक</small><b>{result.date}</b></div>{result.message&&<div className="track-detail full"><small>अतिरिक्त जानकारी</small><b>{result.message}</b></div>}</div>
    </div>}
    {searchState==='idle'&&<div className="empty-card"><span><ClipboardList/></span><h3>अपनी रिक्वेस्ट ट्रैक करें</h3><p>रिक्वेस्ट भेजने के बाद मिली ट्रैकिंग आईडी यहाँ डालें।</p><button className="primary-btn" onClick={()=>go('services')}>नई रिक्वेस्ट बनाएं <ArrowUpRight size={16}/></button></div>}
  </div></main>
}

function ServiceCard({s,onClick}){const Icon=s.icon;return <button className="service-card" onClick={()=>onClick(s)}><div className="service-card-top"><span className="service-icon"><Icon size={22}/></span>{s.tag&&<span className="tag">{s.tag}</span>}</div><h3>{s.title}</h3><p>{s.desc}</p><div className="service-bottom"><b>{s.price}</b><span>विवरण <ArrowUpRight size={15}/></span></div></button>}
createRoot(document.getElementById('root')).render(<App/>);
