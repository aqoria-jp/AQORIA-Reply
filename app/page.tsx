import Link from "next/link";
import BrandLabel from "../components/BrandLabel";
import ProductFooter from "../components/ProductFooter";
import { seed, pClass } from "../lib/demo";

const features = [
  ["01 / TRIAGE", "受信内容を整理", "問い合わせのカテゴリや優先度を確認し、対応の順序を検討できます。"],
  ["02 / REPLY DRAFT", "返信の作成を支援", "問い合わせに応じた返信案を確認し、担当者が内容を編集できます。"],
  ["03 / WORKFLOW", "対応状況を管理", "新着・対応中・確認待ち・完了の状況を一覧と詳細で確認できます。"],
  ["04 / OVERVIEW", "状況をまとめて把握", "未完了や高優先度の件数から、確認が必要な問い合わせを把握できます。"],
];
export default function Home() {
  return <main className="landing">
    <header className="landingNav"><Link className="brand" href="/" aria-label="AQORIA Reply トップ"><BrandLabel /></Link><div className="landingNavRight"><a className="landingCompanyLink" href="https://aqoria-jp.github.io/aqoria/" target="_blank" rel="noopener noreferrer">AQORIAについて ↗</a><Link href="/demo" className="ghostButton">公開デモ</Link></div></header>
    <section className="hero"><div className="heroCopy"><div className="eyebrow">AQORIA / INQUIRY OPERATIONS</div><h1>問い合わせを整理し<br/>次の対応につなげる。</h1><p>受信内容の確認から優先順位の整理、返信案の編集までを一つの画面に。担当者による確認を前提に、問い合わせ対応を支援します。</p><div className="heroButtons"><Link href="/demo" className="primaryButton">公開デモを試す <span aria-hidden="true">→</span></Link><a href="https://aqoria-jp.github.io/aqoria/#contact" className="secondaryButton" target="_blank" rel="noopener noreferrer">導入について相談する ↗</a></div><div className="heroNote">登録不要 / 架空データによる操作デモ / AI API未使用</div></div>
      <div className="heroPanel" aria-label="公開デモと同じサンプルデータによる機能紹介"><div className="miniTop"><div><span className="eyebrow">INBOX</span><strong>問い合わせ対応</strong></div><span className="previewLabel">公開デモのサンプル</span></div>{seed.slice(0, 2).map(item => <div className="mockTicket" key={item.id}><div><b className={pClass(item.priority)}>優先度 {item.priority}</b><span>{item.category}</span></div><strong>{item.subject}</strong><small>{item.company} · {item.status}</small></div>)}<div className="mockReply"><span>REPLY DRAFT</span><p>返信案の確認・編集から対応完了まで、公開デモで操作をお試しいただけます。</p></div><Link className="previewLink" href="/demo">実際の操作画面を開く →</Link></div>
    </section>
    <section className="featureSection"><div className="sectionHead"><div><div className="eyebrow">WHAT IT DOES</div><h2>受信から対応完了までを支援します。</h2></div><p>問い合わせの内容と対応状況を整理し、担当者が次に行うことを確認しやすくします。</p></div><div className="featureGrid">{features.map(([kicker, title, body]) => <article key={title} className="featureCard"><span>{kicker}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="bottomCta"><div><div className="eyebrow">PUBLIC DEMO</div><h2>実際の操作をご確認いただけます。</h2><p>ブラウザ内の架空データだけで動作します。実際のメールは送信されません。</p></div><Link href="/demo" className="primaryButton">公開デモを開く →</Link></section>
    <ProductFooter />
  </main>;
}
