
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Globe, Heart, Wind, Moon, Rocket, Award, Share2, Zap,
  Terminal, User, Coffee
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    title: "Chronos Max",
    subtitle: "Ultimate Life Explorer by Haxor",
    namePlaceholder: "Enter your name...",
    birthDate: "Birth Date",
    birthTime: "Birth Time",
    calculate: "Initialize Scan",
    years: "Years",
    months: "Months",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    nextBirthday: "Next Birthday",
    lifeProgress: "Life Progress (Est. 80y)",
    heartbeats: "Total Heartbeats",
    breaths: "Total Breaths",
    sleep: "Time Spent Sleeping",
    planetaryAge: "Planetary Age",
    mercury: "Mercury",
    venus: "Venus",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    bioTitle: "Haxor Bio Generator",
    copyBio: "Copy Bio",
    stats: "Vital Statistics",
    cosmic: "Cosmic Journey"
  },
  bn: {
    title: "ক্রোনোস ম্যাক্স",
    subtitle: "হ্যাক্সর দ্বারা তৈরি শ্রেষ্ঠ জীবন অনুসন্ধানকারী",
    namePlaceholder: "আপনার নাম লিখুন...",
    birthDate: "জন্ম তারিখ",
    birthTime: "জন্ম সময়",
    calculate: "স্ক্যান শুরু করুন",
    years: "বছর",
    months: "মাস",
    days: "দিন",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    nextBirthday: "পরবর্তী জন্মদিন",
    lifeProgress: "জীবন অগ্রগতি (৮০ বছর হিসেবে)",
    heartbeats: "মোট হৃদস্পন্দন",
    breaths: "মোট শ্বাস-প্রশ্বাস",
    sleep: "নিদ্রায় কাটানো সময়",
    planetaryAge: "গ্রহীয় বয়স",
    mercury: "বুধ",
    venus: "শুক্র",
    mars: "মঙ্গল",
    jupiter: "বৃহস্পতি",
    saturn: "শনি",
    bioTitle: "হ্যাক্সর বায়ো জেনারেটর",
    copyBio: "বায়ো কপি করুন",
    stats: "গুরুত্বপূর্ণ পরিসংখ্যান",
    cosmic: "মহাজাগতিক যাত্রা"
  }
};

const PLANETS = [
  { name: 'mercury', factor: 0.24, icon: '🌑' },
  { name: 'venus', factor: 0.62, icon: '🌕' },
  { name: 'mars', factor: 1.88, icon: '🔴' },
  { name: 'jupiter', factor: 11.86, icon: '🟠' },
  { name: 'saturn', factor: 29.46, icon: '🪐' }
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [birthTime, setBirthTime] = useState('12:00');
  const [now, setNow] = useState(new Date());
  const [showResults, setShowResults] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ageData = useMemo(() => {
    if (!birthDate) return null;
    const start = new Date(`${birthDate}T${birthTime}`);
    const diff = now - start;
    if (diff < 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const nextBday = new Date(start);
    nextBday.setFullYear(now.getFullYear());
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysToBday = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));

    return {
      years, months, days,
      totalDays, totalHours, totalMinutes, totalSeconds,
      daysToBday,
      heartbeats: totalMinutes * 72,
      breaths: totalMinutes * 16,
      sleepYears: (years / 3).toFixed(1),
      lifeProgress: Math.min((years / 80) * 100, 100).toFixed(2)
    };
  }, [birthDate, birthTime, now]);

  const generateBio = () => {
    if (!ageData) return "";
    const n = name || "User";
    return lang === 'en'
      ? `🚀 ${n} | Living for ${ageData.years} years.\nSunrises: ${ageData.totalDays}\nHeartbeats: ${(ageData.heartbeats/1e6).toFixed(1)}M\nBuilt by Haxor`
      : `🚀 ${n} | ${ageData.years} বছর।\nসূর্যোদয়: ${ageData.totalDays}\nহৃদস্পন্দন: ${(ageData.heartbeats/1e6).toFixed(1)}M\nতৈরি: হ্যাক্সর`;
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <div className="space-x-2">
            <button onClick={() => setLang('en')}>EN</button>
            <button onClick={() => setLang('bn')}>BN</button>
          </div>
        </header>

        <input className="w-full p-2" placeholder={t.namePlaceholder} value={name} onChange={e=>setName(e.target.value)} />
        <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} />
        <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)} />

        {!showResults && <button onClick={()=>setShowResults(true)}>{t.calculate}</button>}

        {showResults && ageData && (
          <>
            <div>{ageData.years} {t.years}</div>
            <div>{ageData.daysToBday} days to birthday</div>
            <pre>{generateBio()}</pre>
            <button onClick={()=>copyToClipboard(generateBio())}>{t.copyBio}</button>
          </>
        )}
      </div>
    </div>
  );
}
