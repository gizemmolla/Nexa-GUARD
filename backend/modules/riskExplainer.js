// backend/modules/riskExplainer.js
//deneme

export function explainRisks(risks) {
  const parts = [];

  // Unlimited mint
  if (risks.unlimitedMint) {
    parts.push(
      "🔴 Unlimited Mint: Bu token sınırsız şekilde basılabilir. Geliştirici arzı istediği kadar artırabilir; bu da fiyatın ciddi şekilde düşmesine ve rugpull senaryolarına zemin hazırlar."
    );
  } else {
    parts.push(
      "🟢 Unlimited Mint yok: Arz kontrollü görünüyor, geliştirici sınırsız token basamıyor."
    );
  }

  // Anyone can mint
  if (risks.anyoneCanMint) {
    parts.push(
      "🟠 Public Mint: Mint fonksiyonu herkese açık. Her kullanıcı yeni token üretebileceği için arz manipülasyonu ve spam riski bulunuyor."
    );
  } else {
    parts.push(
      "🟢 Public Mint bulunmuyor: Mint yetkisi belirli rollere kısıtlanmış gibi görünüyor."
    );
  }

  // Pause function
  if (risks.hasPause) {
    parts.push(
      "🟡 Pause Function: Kontratta işlemleri durdurabilecek bir pause fonksiyonu var. Bu, acil durumlarda faydalı olabilir ama aynı zamanda geliştiricinin işlemleri tek taraflı durdurma gücü olduğu anlamına gelir."
    );
  } else {
    parts.push(
      "🟢 Pause Function yok: Kontrat üzerinde global bir durdurma mekanizması tespit edilmedi."
    );
  }

  // Upgradeable
  if (risks.upgradeable) {
    parts.push(
      "🟠 Upgradeable Contract: Kontrat yükseltilebilir durumda. İleride geliştirici kontratın davranışını tamamen değiştirebilir; bu da güven için ek şeffaflık ve denetim ihtiyacı doğurur."
    );
  } else {
    parts.push(
      "🟢 Upgradeable özelliği yok: Kontrat değiştirilemez; deploy edilen mantık sabit kalır."
    );
  }

  // Metni tek bir paragraf halinde döndür
  return parts.join("\n\n");
}
