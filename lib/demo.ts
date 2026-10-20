export type Status = "新着" | "対応中" | "確認待ち" | "完了";
export type Priority = "高" | "中" | "低";
export type Category = "不具合" | "料金・契約" | "導入相談" | "請求" | "その他";
export type Sentiment = "緊急" | "不満" | "通常" | "前向き";

export type Inquiry = {
  id: string; company: string; name: string; email: string; subject: string; body: string; receivedAt: string;
  status: Status; priority: Priority; category: Category; sentiment: Sentiment; summary: string; reply: string;
};

export const STORAGE_KEY = "aqoria-reply-demo-v10";
export const statuses: Status[] = ["新着", "対応中", "確認待ち", "完了"];

export const seed: Inquiry[] = [
  { id:"inq-001", company:"デモ企業A", name:"山口 健", email:"yamaguchi@example.jp", subject:"ログインできず業務が止まっています", body:"今朝から複数名でログインできません。パスワード再設定も試しましたが改善せず、現場の対応が止まっています。至急確認をお願いします。", receivedAt:"2026/09/13 09:12", status:"新着", priority:"高", category:"不具合", sentiment:"緊急", summary:"複数ユーザーでログイン不可。パスワード再設定でも改善せず、業務影響あり。", reply:"お問い合わせありがとうございます。ご不便をおかけしており申し訳ございません。複数名でログインできない状況とのこと、優先度を上げて確認いたします。差し支えなければ、エラー表示の内容と発生しているユーザー数をご共有ください。確認でき次第、担当よりご連絡いたします。" },
  { id:"inq-002", company:"デモ企業B", name:"佐藤 美咲", email:"sato@example.jp", subject:"20名で利用する場合の料金について", body:"社内で導入を検討しています。まずは20名程度で使う想定ですが、月額料金と初期費用の目安を教えていただけますか？", receivedAt:"2026/09/13 10:04", status:"対応中", priority:"中", category:"料金・契約", sentiment:"前向き", summary:"20名規模での導入検討。月額料金と初期費用の目安を確認したい。", reply:"お問い合わせありがとうございます。20名程度でのご利用をご検討とのこと、用途や必要な機能によって構成が変わるため、まずは利用イメージを確認したうえで最適なプランをご案内しております。差し支えなければ、主な利用目的と必要な機能をお知らせください。" },
  { id:"inq-003", company:"デモ企業C", name:"高橋 誠", email:"takahashi@example.jp", subject:"請求書の宛名を変更したい", body:"今月分から請求書の宛名を『デモ企業C 情報システム部』へ変更できますでしょうか。", receivedAt:"2026/09/13 10:46", status:"新着", priority:"低", category:"請求", sentiment:"通常", summary:"今月分から請求書の宛名変更を希望。", reply:"お問い合わせありがとうございます。請求書の宛名変更について承りました。今月分からの反映可否を確認いたします。念のため、変更後の正式な宛名とご担当者様情報に相違がないかご確認をお願いいたします。" },
  { id:"inq-004", company:"デモ企業D", name:"鈴木 彩", email:"suzuki@example.jp", subject:"資料検索機能について詳しく知りたい", body:"PDFやWordを登録して社内FAQのように検索できる機能に興味があります。権限を部署ごとに分けることもできますか？", receivedAt:"2026/09/12 16:32", status:"確認待ち", priority:"中", category:"導入相談", sentiment:"前向き", summary:"社内資料検索と部署別権限の可否を確認したい。", reply:"お問い合わせありがとうございます。PDFやWordなどの社内資料を検索対象として活用する構成は可能です。部署ごとの閲覧範囲についても、運用方法に合わせて権限設計を行えます。現在の資料管理方法と、想定している利用部署をお伺いできれば、具体的な構成をご案内します。" },
  { id:"inq-005", company:"デモ企業E", name:"田中 直樹", email:"tanaka@example.jp", subject:"回答が遅く困っています", body:"先週問い合わせた件についてまだ返事がありません。社内で判断できず困っているので、状況だけでも教えてください。", receivedAt:"2026/09/12 14:05", status:"対応中", priority:"高", category:"その他", sentiment:"不満", summary:"先週の問い合わせが未回答。判断に必要なため、進捗確認を希望。", reply:"ご連絡ありがとうございます。回答をお待たせしており申し訳ございません。現在の確認状況を担当へ至急確認し、まず進捗をご案内いたします。お待たせしている件を優先して確認いたします。" },
  { id:"inq-006", company:"デモ企業F", name:"小林 翔", email:"kobayashi@example.jp", subject:"導入前にデモを見たいです", body:"営業チームでの利用を検討中です。実際の画面を見ながら30分ほど説明いただくことは可能でしょうか。", receivedAt:"2026/09/11 18:24", status:"完了", priority:"中", category:"導入相談", sentiment:"前向き", summary:"営業チームで導入検討。30分程度のデモ説明を希望。", reply:"お問い合わせありがとうございます。オンラインでのデモ説明が可能です。ご都合のよい日時を2〜3候補お送りいただければ、日程を調整してご案内いたします。" }
];

export function cloneSeed() { return JSON.parse(JSON.stringify(seed)) as Inquiry[]; }
export function pClass(p: Priority) { return p === "高" ? "priority high" : p === "中" ? "priority medium" : "priority low"; }

export function analyze(text: string) {
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

export function normalizeInquiries(value: unknown): Inquiry[] {
  if (!Array.isArray(value) || !value.length) return cloneSeed();
  const stringFields = ["id", "company", "name", "email", "subject", "body", "receivedAt", "summary", "reply"] as const;
  const valid = value.every(item => item && typeof item === "object" && stringFields.every(key => typeof item[key] === "string") && statuses.includes(item.status) && ["高", "中", "低"].includes(item.priority) && ["不具合", "料金・契約", "導入相談", "請求", "その他"].includes(item.category) && ["緊急", "不満", "通常", "前向き"].includes(item.sentiment));
  if (!valid || new Set(value.map(item => item.id)).size !== value.length) return cloneSeed();
  return value as Inquiry[];
}
export function filterInquiries(items: Inquiry[], status: "すべて" | Status, query: string): Inquiry[] {
  const q = query.trim().toLowerCase();
  return items.filter(item => (status === "すべて" || item.status === status) && (!q || [item.company, item.name, item.email, item.subject, item.body, item.category].join(" ").toLowerCase().includes(q)));
}
export function getMetrics(items: Inquiry[]) {
  return { open: items.filter(item => item.status !== "完了").length, high: items.filter(item => item.priority === "高" && item.status !== "完了").length, positive: items.filter(item => item.sentiment === "前向き").length, complete: items.filter(item => item.status === "完了").length };
}
export function updateInquiry(items: Inquiry[], id: string, patch: Partial<Inquiry>): Inquiry[] {
  return items.map(item => item.id === id ? { ...item, ...patch } : item);
}
