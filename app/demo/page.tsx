"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BrandLabel from "../../components/BrandLabel";
import ProductFooter from "../../components/ProductFooter";
import { analyze, cloneSeed, filterInquiries, getMetrics, normalizeInquiries, pClass, seed, statuses, STORAGE_KEY, updateInquiry, type Inquiry, type Status } from "../../lib/demo";

export default function DemoPage() {
  const [items, setItems] = useState<Inquiry[]>(cloneSeed);
  const [selectedId, setSelectedId] = useState(seed[0].id);
  const [filter, setFilter] = useState<"すべて" | Status>("すべて");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(seed[0].reply);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [notice, setNotice] = useState("");
  const [mobileDetail, setMobileDetail] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const filtered = useMemo(() => filterInquiries(items, filter, query), [items, filter, query]);
  const selected = filtered.find(item => item.id === selectedId) ?? filtered[0] ?? null;
  const stats = useMemo(() => getMetrics(items), [items]);
  const draftChanged = !!selected && draft !== selected.reply;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = normalizeInquiries(JSON.parse(saved));
        setItems(restored); setSelectedId(restored[0].id); setDraft(restored[0].reply);
      }
    } catch { setStorageAvailable(false); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch { setStorageAvailable(false); }
  }, [items, ready]);
  const visibleId = selected?.id;
  useEffect(() => {
    if (!visibleId) return;
    const item = items.find(item => item.id === visibleId);
    if (item) { setSelectedId(item.id); setDraft(item.reply); }
  }, [visibleId, items]);

  function persistDraft() {
    if (selected && draftChanged) setItems(current => updateInquiry(current, selected.id, { reply: draft }));
  }
  function choose(id: string) { persistDraft(); setSelectedId(id); setMobileDetail(true); setNotice(""); }
  function filterTo(next: "すべて" | Status) { persistDraft(); setFilter(next); setNotice(""); }
  function search(value: string) { persistDraft(); setQuery(value); setNotice(""); }
  function patchSelected(patch: Partial<Inquiry>) {
    if (selected) setItems(current => updateInquiry(current, selected.id, patch));
  }
  function reanalyze() {
    if (!selected) return;
    const { reply: _reply, ...classification } = analyze(selected.body);
    patchSelected({ ...classification, reply: draft }); setNotice("サンプルの判定ルールで分類・優先度・要約を更新しました。返信の下書きは変更していません。");
  }
  function regenerate() {
    if (!selected) return;
    setDraft(analyze(selected.body).reply); setNotice("返信案のサンプルを作成しました。内容を確認し、必要に応じて編集してください。");
  }
  function saveDraft() { patchSelected({ reply: draft }); setNotice("下書きをこのブラウザのデモに保存しました。"); }
  function complete() { patchSelected({ reply: draft, status: "完了" }); setNotice("デモ上の対応状況を完了にしました。実際のメールは送信していません。"); }
  function reset() { const fresh = cloneSeed(); setItems(fresh); setSelectedId(fresh[0].id); setDraft(fresh[0].reply); setFilter("すべて"); setQuery(""); setMobileDetail(false); setNotice("デモを初期状態に戻しました。"); }
  async function copyDraft() {
    try { await navigator.clipboard.writeText(draft); setNotice("返信案をコピーしました。実際のメール送信は行っていません。"); }
    catch { textarea.current?.focus(); textarea.current?.select(); setNotice("自動コピーを利用できません。選択された文章を手動でコピーしてください。"); }
  }

  return <main className="demoShell">
    <header className="demoTopbar"><Link className="brand" href="/" aria-label="AQORIA Reply トップ"><BrandLabel /></Link><div className="topActions"><span className="safeBadge">公開デモ</span><button type="button" className="topReset" onClick={reset}>リセット</button><a className="headerContact" href="https://aqoria-jp.github.io/aqoria/#contact" target="_blank" rel="noopener noreferrer">導入について相談する ↗</a></div></header>
    <div className="demoContainer">
      <div className="breadcrumb"><span>AQORIA Reply</span><span aria-hidden="true">/</span><span>問い合わせ対応</span></div>
      <section className="demoIntro" aria-labelledby="demo-title"><div><div className="eyebrow">INQUIRY OPERATIONS</div><h1 id="demo-title">問い合わせ対応</h1><p>受信内容の整理から返信の作成、対応状況の確認までをまとめて行えます。</p></div><span className="workspaceLabel">サンプル株式会社 <small>架空のワークスペース</small></span></section>
      <div className="demoNotice"><span aria-hidden="true">i</span><p><strong>架空データを使った操作デモです。</strong> 分類と返信案はサンプルの判定ルール・定型文で表示します。AI APIは使用せず、実際のメールは送信しません。</p></div>
      {!storageAvailable && <p className="storageNotice" role="status">このブラウザでは変更内容を保存できません。画面を開いている間は操作できますが、再読み込みすると初期状態に戻る場合があります。</p>}
      <div className="demoMetrics" aria-label="問い合わせの集計"><div><span>未完了の問い合わせ</span><b>{stats.open}<small>件</small></b><p>新着・対応中・確認待ち</p></div><div><span>高優先度</span><b>{stats.high}<small>件</small></b><p>未完了のうち優先度が高いもの</p></div><div><span>前向きな問い合わせ</span><b>{stats.positive}<small>件</small></b><p>サンプルの分類結果</p></div><div><span>対応完了</span><b>{stats.complete}<small>件</small></b><p>完了として記録した件数</p></div></div>
      {notice && <div className="liveNotice" role="status">{notice}</div>}
      <section className={`workbench ${mobileDetail ? "showDetail" : ""}`} aria-label="問い合わせの一覧と詳細">
        <aside className="inboxPane"><div className="paneHeader"><div><span className="eyebrow">INBOX</span><h2>問い合わせ一覧</h2></div><span className="countBadge">{filtered.length}件</span></div>
          <div className="inboxSearch"><svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><label htmlFor="inquiry-search" className="srOnly">問い合わせを検索</label><input id="inquiry-search" placeholder="会社名・件名・内容で検索" value={query} onChange={event => search(event.target.value)} autoComplete="off"/></div>
          <div className="statusTabs" role="group" aria-label="対応状況で絞り込み">{(["すべて", ...statuses] as const).map(status => <button type="button" key={status} onClick={() => filterTo(status)} className={filter === status ? "active" : ""} aria-pressed={filter === status}>{status}</button>)}</div>
          <div className="ticketList">{filtered.length ? filtered.map(item => <button type="button" key={item.id} className={`ticket ${item.id === selected?.id ? "selected" : ""}`} onClick={() => choose(item.id)} aria-pressed={item.id === selected?.id}><div className="ticketMeta"><span className={pClass(item.priority)}>優先度 {item.priority}</span><span>{item.category}</span><small>{item.receivedAt.split(" ")[1]}</small></div><strong>{item.subject}</strong><p>{item.company}</p><div className="ticketBottom"><span className={item.status === "完了" ? "statusDot completed" : "statusDot"}>{item.status}</span><span>{item.sentiment}</span><span className="ticketArrow" aria-hidden="true">→</span></div></button>) : <div className="listEmpty"><strong>該当する問い合わせはありません</strong><p>検索条件や対応状況を変更してください。</p><button type="button" onClick={() => { setQuery(""); setFilter("すべて"); }}>絞り込みを解除する</button></div>}</div><div className="inboxFootnote">変更内容はこのブラウザ内に保存されます。</div>
        </aside>
        <section className="detailPane" aria-label="選択した問い合わせの詳細"><button type="button" className="mobileBack" onClick={() => { persistDraft(); setMobileDetail(false); }}>← 問い合わせ一覧に戻る</button>
          {selected ? <><div className="detailHead"><div><div className="detailMeta"><span className={pClass(selected.priority)}>優先度 {selected.priority}</span><span className="categoryPill">{selected.category}</span><span className="categoryPill">{selected.sentiment}</span></div><h2>{selected.subject}</h2><div className="senderInfo"><span>{selected.company} / {selected.name}</span><span>{selected.email}</span><span>{selected.receivedAt}</span></div></div><div className="statusControl"><label htmlFor="inquiry-status">対応状況</label><select id="inquiry-status" value={selected.status} onChange={event => { patchSelected({ status: event.target.value as Status, reply: draft }); setNotice("デモの対応状況を更新しました。"); }} className="statusSelect">{statuses.map(status => <option key={status}>{status}</option>)}</select></div></div>
          <div className="contentGrid"><article className="contentCard"><div className="cardLabel">ORIGINAL MESSAGE</div><h3>お問い合わせ内容</h3><p className="messageBody">{selected.body}</p></article><article className="contentCard analysisCard"><div className="analysisHead"><div><div className="cardLabel">TRIAGE</div><h3>内容の整理</h3></div><button type="button" onClick={reanalyze}>再解析 ↗</button></div><div className="analysisRows"><div><span>分類</span><b>{selected.category}</b></div><div><span>優先度</span><b>{selected.priority}</b></div><div><span>感情</span><b>{selected.sentiment}</b></div></div><div className="summaryBox"><span>要約</span><p>{selected.summary}</p></div><p className="analysisNote">公開デモではサンプルの判定ルールを使用します。</p></article></div>
          <article className="replyCard"><div className="replyHead"><div><div className="cardLabel">REPLY DRAFT</div><h3>返信案を確認・編集する</h3></div><div className="replyActions"><button type="button" onClick={regenerate}>返信案を作成</button><button type="button" onClick={copyDraft}>コピー ↗</button></div></div><label className="srOnly" htmlFor="reply-draft">返信案の本文</label><textarea id="reply-draft" ref={textarea} value={draft} onChange={event => setDraft(event.target.value)} spellCheck={false}/><div className="draftMeta"><span className={draftChanged ? "draftUnsaved" : "draftSaved"}>{draftChanged ? "未保存の変更があります" : "保存済みの下書き"}</span><span>{draft.length}文字</span></div><div className="replyFooter"><div><span>内容を確認してからご利用ください。実際のメールは送信されません。</span><small>別の問い合わせに切り替える際は、編集中の下書きを保存します。</small></div><div><button type="button" className="secondaryAction" onClick={saveDraft}>下書きを保存</button><button type="button" className="primaryAction" onClick={complete}>対応を完了する <span aria-hidden="true">✓</span></button></div></div></article></> : <div className="detailEmpty"><svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M7 10h26v21H7z"/><path d="m7 11 13 11 13-11"/></svg><h2>問い合わせを選択してください</h2><p>一覧から問い合わせを選ぶと、受信内容と返信案を確認できます。</p></div>}
        </section>
      </section>
    </div>
    <ProductFooter />
  </main>;
}
