import Link from "next/link";

const features = [
  ["AUTO TRIAGE", "問い合わせを分類", "カテゴリ・優先度・感情を整理して、対応順を分かりやすくします。"],
  ["REPLY DRAFT", "返信案をすぐ作成", "問い合わせ内容に合わせた一次返信案を作り、担当者が編集して利用できます。"],
  ["WORKFLOW", "対応状況を管理", "新着・対応中・確認待ち・完了を一つの画面で管理できます。"],
  ["INSIGHT", "問い合わせ傾向を可視化", "カテゴリ・優先度・未完了件数を確認し、改善につなげます。"],
];

export default function Home() {
  return (
    <main className="landing">
      <header className="landingNav">
        <div className="brand">AQORIA REPLY</div>
        <div className="landingNavRight"><span>INQUIRY OPERATIONS</span><Link href="/demo" className="ghostButton">公開デモ</Link></div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow">AI-ASSISTED INQUIRY OPERATIONS</div>
          <h1>問い合わせ対応を<br/><span>止めない仕組みへ</span></h1>
          <p>メールやフォームから届く問い合わせを整理し、優先順位・要約・返信案まで一つの画面で確認。対応漏れや返信作成の負担を減らす業務支援システムです。</p>
          <div className="heroButtons"><Link href="/demo" className="primaryButton">実際にデモを触る →</Link><a href="https://aqoria-jp.github.io/aqoria/" className="secondaryButton">AQORIAについて</a></div>
          <div className="heroNote">登録不要 / 架空データのみ / AI API未使用</div>
        </div>
        <div className="heroPanel">
          <div className="miniTop"><span>INBOX</span><b>6件</b></div>
          <div className="mockTicket urgent"><div><b>HIGH</b><span>不具合</span></div><strong>ログインできず業務が止まっています</strong><small>北辰サービス株式会社</small></div>
          <div className="mockTicket"><div><b>MEDIUM</b><span>導入相談</span></div><strong>20名で利用する場合の料金を知りたい</strong><small>みらい学習センター</small></div>
          <div className="mockReply"><span>REPLY DRAFT</span><p>お問い合わせありがとうございます。状況を確認し、担当より優先してご案内いたします。</p></div>
        </div>
      </section>

      <section className="featureSection">
        <div className="sectionHead"><div><div className="eyebrow">WHAT IT DOES</div><h2>受信から返信までを、一つの流れに</h2></div><p>問い合わせ対応の「読む・判断する・書く・追う」をまとめて整理します。</p></div>
        <div className="featureGrid">{features.map(([kicker,title,body]) => <article key={title} className="featureCard"><span>{kicker}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="bottomCta"><div><div className="eyebrow">PUBLIC DEMO</div><h2>まずは操作して確認</h2><p>ブラウザ内の架空データだけで動作する営業デモです。</p></div><Link href="/demo" className="primaryButton">デモを開く →</Link></section>
    </main>
  );
}
