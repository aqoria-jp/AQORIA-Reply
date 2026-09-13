"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Status = "新着" | "対応中" | "確認待ち" | "完了";
type Priority = "高" | "中" | "低";
type Category = "不具合" | "料金・契約" | "導入相談" | "請求" | "その他";
type Sentiment = "緊急" | "不満" | "通常" | "前向き";

type Inquiry = {
  id: string; company: string; name: string; email: string; subject: string; body: string; receivedAt: string;
  status: Status; priority: Priority; category: Category; sentiment: Sentiment; summary: string; reply: string;
};

const STORAGE_KEY = "aqoria-reply-demo-v10";
const statuses: Status[] = ["新着", "対応中", "確認待ち", "完了"];

const seed: Inquiry[] = [
  { id:"inq-001", company:"北辰サービス株式会社", name:"山口 健", email:"yamaguchi@example.jp", subject:"ログインできず業務が止まっています", body:"今朝から複数名でログインできません。パスワード再設定も試しましたが改善せず、現場の対応が止まっています。至急確認をお願いします。", receivedAt:"2026/09/13 09:12", status:"新着", priority:"高", category:"不具合", sentiment:"緊急", summary:"複数ユーザーでログイン不可。パスワード再設定でも改善せず、業務影響あり。", reply:"お問い合わせありがとうございます。ご不便をおかけしており申し訳ございません。複数名でログインできない状況とのこと、優先度を上げて確認いたします。差し支えなければ、エラー表示の内容と発生しているユーザー数をご共有ください。確認でき次第、担当よりご連絡いたします。" },
  { id:"inq-002", company:"みらい学習センター", name:"佐藤 美咲", email:"sato@example.jp", subject:"20名で利用する場合の料金について", body:"社内で導入を検討しています。まずは20名程度で使う想定ですが、月額料金と初期費用の目安を教えていただけますか？", receivedAt:"2026/09/13 10:04", status:"対応中", priority:"中", category:"料金・契約", sentiment:"前向き", summary:"20名規模での導入検討。月額料金と初期費用の目安を確認したい。", reply:"お問い合わせありがとうございます。20名程度でのご利用をご検討とのこと、用途や必要な機能によって構成が変わるため、まずは利用イメージを確認したうえで最適なプランをご案内しております。差し支えなければ、主な利用目的と必要な機能をお知らせください。" },
  { id:"inq-003", company:"青葉設備工業", name:"高橋 誠", email:"takahashi@example.jp", subject:"請求書の宛名を変更したい", body:"今月分から請求書の宛名を『青葉設備工業株式会社 情報システム部』へ変更できますでしょうか。", receivedAt:"2026/09/13 10:46", status:"新着", priority:"低", category:"請求", sentiment:"通常", summary:"今月分から請求書の宛名変更を希望。", reply:"お問い合わせありがとうございます。請求書の宛名変更について承りました。今月分からの反映可否を確認いたします。念のため、変更後の正式な宛名とご担当者様情報に相違がないかご確認をお願いいたします。" },
  { id:"inq-004", company:"中央企画", name:"鈴木 彩", email:"suzuki@example.jp", subject:"資料検索機能について詳しく知りたい", body:"PDFやWordを登録して社内FAQのように検索できる機能に興味があります。権限を部署ごとに分けることもできますか？", receivedAt:"2026/09/12 16:32", status:"確認待ち", priority:"中", category:"導入相談", sentiment:"前向き", summary:"社内資料検索と部署別権限の可否を確認したい。", reply:"お問い合わせありがとうございます。PDFやWordなどの社内資料を検索対象として活用する構成は可能です。部署ごとの閲覧範囲についても、運用方法に合わせて権限設計を行えます。現在の資料管理方法と、想定している利用部署をお伺いできれば、具体的な構成をご案内します。" },
  { id:"inq-005", company:"東都物流株式会社", name:"田中 直樹", email:"tanaka@example.jp", subject:"回答が遅く困っています", body:"先週問い合わせた件についてまだ返事がありません。社内で判断できず困っているので、状況だけでも教えてください。", receivedAt:"2026/09/12 14:05", status:"対応中", priority:"高", category:"その他", sentiment:"不満", summary:"先週の問い合わせが未回答。判断に必要なため、進捗確認を希望。", reply:"ご連絡ありがとうございます。回答をお待たせしており申し訳ございません。現在の確認状況を担当へ至急確認し、まず進捗をご案内いたします。お待たせしている件を優先して確認いたします。" },
  { id:"inq-006", company:"サンプル商事", name:"小林 翔", email:"kobayashi@example.jp", subject:"導入前にデモを見たいです", body:"営業チームでの利用を検討中です。実際の画面を見ながら30分ほど説明いただくことは可能でしょうか。", receivedAt:"2026/09/11 18:24", status:"完了", priority:"中", category:"導入相談", sentiment:"前向き", summary:"営業チームで導入検討。30分程度のデモ説明を希望。", reply:"お問い合わせありがとうございます。オンラインでのデモ説明が可能です。ご都合のよい日時を2〜3候補お送りいただければ、日程を調整してご案内いたします。" }
];

function cloneSeed() { return JSON.parse(JSON.stringify(seed)) as Inquiry[]; }
function pClass(p: Priority) { return p === "高" ? "priority high" : p === "中" ? "priority medium" : "priority low"; }

function analyze(text: string) {
  const t = text.toLowerCase();
  let category: Category = "その他"; let priority: Priority = "中"; let sentiment: Sentiment = "通常";
  if (/ログイン|エラー|動か|不具合|停止|使え/.test(t)) category = "不具合";
  else if (/料金|費用|契約|プラン/.test(t)) category = "料金・契約";
  else if (/導入|デモ|資料検索|権限/.test(t)) category = "導入相談";
  else if (/請求|請求書|支払/.test(t)) category = "請求";
  if (/至急|止ま|困って|返事がない|緊急/.test(t)) priority = "高";
  if (/宛名|変更できますか/.test(t) && category === "請求") priority = "低";
  if (/至急|止ま|緊急/.test(t)) sentiment = "緊急";
  else if (/困って|返事がない|遅/.test(t)) sentiment = "不満";
  else if (/検討|興味|デモ|導入/.test(t)) sentiment = "前向き";
  const summary = text.length > 68 ? `${text.slice(0,68)}…` : text;
  const reply = priority === "高" ? "お問い合わせありがとうございます。ご不便をおかけしており申し訳ございません。内容を優先して確認いたします。担当者へ状況を共有し、確認でき次第ご連絡いたします。" : category === "導入相談" ? "お問い合わせありがとうございます。ご検討内容に合わせてご案内可能です。現在の運用方法や想定利用人数、必要な機能を確認できれば、具体的な構成をご案内いたします。" : category === "料金・契約" ? "お問い合わせありがとうございます。料金・契約内容については、ご利用人数や必要な機能によって構成が変わります。想定されている利用方法を確認のうえ、適した内容をご案内いたします。" : category === "請求" ? "お問い合わせありがとうございます。請求に関するご依頼を確認いたしました。必要事項を確認のうえ、反映可否を担当よりご案内いたします。" : "お問い合わせありがとうございます。内容を確認し、担当者よりご案内いたします。追加で確認が必要な場合は、こちらからご連絡いたします。";
  return { priority, category, sentiment, summary, reply };
}

export default function DemoPage() {
  const [items,setItems] = useState<Inquiry[]>(cloneSeed());
  const [selectedId,setSelectedId] = useState(seed[0].id);
  const [filter,setFilter] = useState<"すべて"|Status>("すべて");
  const [query,setQuery] = useState("");
  const [draft,setDraft] = useState(seed[0].reply);
  const [copied,setCopied] = useState(false);
  const [ready,setReady] = useState(false);

  useEffect(()=>{ try { const s=localStorage.getItem(STORAGE_KEY); if(s){ const p=JSON.parse(s) as Inquiry[]; if(p.length){ setItems(p); setSelectedId(p[0].id); setDraft(p[0].reply); } } } catch{} setReady(true); },[]);
  useEffect(()=>{ if(ready) localStorage.setItem(STORAGE_KEY,JSON.stringify(items)); },[items,ready]);

  const selected = items.find(i=>i.id===selectedId) ?? items[0];
  useEffect(()=>{ if(selected) setDraft(selected.reply); },[selectedId]);

  const filtered = useMemo(()=>items.filter(i=>{
    const statusOk = filter === "すべて" || i.status===filter;
    const q=query.trim().toLowerCase();
    const queryOk=!q || [i.company,i.name,i.subject,i.body,i.category].join(" ").toLowerCase().includes(q);
    return statusOk && queryOk;
  }),[items,filter,query]);

  const stats = useMemo(()=>({
    open: items.filter(i=>i.status!=="完了").length,
    high: items.filter(i=>i.priority==="高" && i.status!=="完了").length,
    positive: items.filter(i=>i.sentiment==="前向き").length,
    complete: items.filter(i=>i.status==="完了").length,
  }),[items]);

  if(!selected) return null;
  const update=(patch:Partial<Inquiry>)=>setItems(cur=>cur.map(i=>i.id===selected.id?{...i,...patch}:i));
  const regen=()=>{ const r=analyze(selected.body); update(r); setDraft(r.reply); };
  const reset=()=>{ const f=cloneSeed(); setItems(f); setSelectedId(f[0].id); setDraft(f[0].reply); localStorage.setItem(STORAGE_KEY,JSON.stringify(f)); };
  const copy=async()=>{ try{ await navigator.clipboard.writeText(draft); setCopied(true); setTimeout(()=>setCopied(false),1200);}catch{} };

  return <main className="demoShell">
    <header className="demoTopbar"><div className="topBrand"><Link href="/">AQORIA REPLY</Link><span>PUBLIC DEMO</span></div><div className="topActions"><span className="safeBadge">架空データ / AI API未使用</span><button className="topReset" onClick={reset}>デモをリセット</button></div></header>
    <section className="demoIntro"><div><div className="eyebrow">INQUIRY OPERATIONS</div><h1>問い合わせ対応AIデモ</h1><p>受信内容を整理し、優先順位・分類・要約・返信案まで確認できます。</p></div><div className="demoMetrics"><div><span>未完了</span><b>{stats.open}</b></div><div><span>高優先度</span><b>{stats.high}</b></div><div><span>導入意欲あり</span><b>{stats.positive}</b></div><div><span>完了</span><b>{stats.complete}</b></div></div></section>
    <section className="workbench">
      <aside className="inboxPane">
        <div className="paneHeader"><div><span className="eyebrow">INBOX</span><h2>問い合わせ</h2></div><span className="countBadge">{filtered.length}件</span></div>
        <input className="searchInput" placeholder="会社名・件名・内容で検索" value={query} onChange={e=>setQuery(e.target.value)} />
        <div className="statusTabs">{(["すべて",...statuses] as const).map(s=><button key={s} onClick={()=>setFilter(s)} className={filter===s?"active":""}>{s}</button>)}</div>
        <div className="ticketList">{filtered.map(i=><button key={i.id} className={`ticket ${i.id===selected.id?"selected":""}`} onClick={()=>setSelectedId(i.id)}><div className="ticketMeta"><span className={pClass(i.priority)}>{i.priority}</span><span>{i.category}</span><small>{i.receivedAt.split(" ")[1]}</small></div><strong>{i.subject}</strong><p>{i.company}</p><div className="ticketBottom"><span>{i.status}</span><span>{i.sentiment}</span></div></button>)}</div>
      </aside>
      <section className="detailPane">
        <div className="detailHead"><div><div className="detailMeta"><span className={pClass(selected.priority)}>優先度 {selected.priority}</span><span className="categoryPill">{selected.category}</span><span className="categoryPill">{selected.sentiment}</span></div><h2>{selected.subject}</h2><p>{selected.company} / {selected.name} / {selected.email}</p></div><select value={selected.status} onChange={e=>update({status:e.target.value as Status})} className="statusSelect">{statuses.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="contentGrid"><article className="contentCard"><div className="cardLabel">ORIGINAL MESSAGE</div><p className="messageBody">{selected.body}</p></article><article className="contentCard analysisCard"><div className="analysisHead"><div className="cardLabel">AUTO ANALYSIS</div><button onClick={regen}>再解析</button></div><div className="analysisRows"><div><span>分類</span><b>{selected.category}</b></div><div><span>優先度</span><b>{selected.priority}</b></div><div><span>感情</span><b>{selected.sentiment}</b></div></div><div className="summaryBox"><span>要約</span><p>{selected.summary}</p></div></article></div>
        <article className="replyCard"><div className="replyHead"><div><div className="cardLabel">REPLY DRAFT</div><h3>返信案</h3></div><div className="replyActions"><button onClick={regen}>返信案を再生成</button><button onClick={copy}>{copied?"コピーしました":"コピー"}</button></div></div><textarea value={draft} onChange={e=>setDraft(e.target.value)} /><div className="replyFooter"><span>担当者が内容を確認・編集してから送信する想定です。</span><div><button className="secondaryAction" onClick={()=>update({reply:draft})}>下書きを保存</button><button className="primaryAction" onClick={()=>update({reply:draft,status:"完了"})}>送信済みにする</button></div></div></article>
      </section>
    </section>
  </main>;
}
