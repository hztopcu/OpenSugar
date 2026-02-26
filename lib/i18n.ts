/**
 * Simple i18n dictionary for TR/EN. Keys are shared; values are per locale.
 */

export type Locale = "en" | "tr";

export const defaultLocale: Locale = "en";

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // App & Nav
    "app.title": "OpenSugar – Blood Glucose Tracker",
    "dashboard.title": "OpenSugar",
    "dashboard.subtitle": "Blood glucose & medication tracker",
    "add.title": "Add Entry",
    "add.subtitle": "Log glucose or medication",
    "add.glucoseCard": "Glucose reading",
    "add.medicationCard": "Medication log",
    "add.medicationCardHint": "Log when you took a medication",
    "add.typeFasting": "Fasting",
    "add.typeAfterMeal": "After Meal",
    "add.typeBedtime": "Bedtime",
    "add.typeOther": "Other",
    "nav.dashboard": "Dashboard",
    "nav.addEntry": "Add Entry",
    "nav.medications": "Medications",
    "nav.lab": "Lab",
    "nav.report": "Report",
    "nav.signOut": "Sign out",

    // Lab page
    "lab.title": "Blood Lab Results",
    "lab.subtitle": "HbA1c, cholesterol, blood pressure",
    "lab.addResult": "Add lab result",
    "lab.history": "History",
    "lab.noResults": "No lab results yet. Add one above.",
    "lab.hba1cProgression": "HbA1c progression",
    "lab.hba1cProgressionHint": "3–6 month trend (target often <7%)",
    "lab.saveLabResult": "Save lab result",
    "lab.saving": "Saving…",
    "lab.saved": "Saved.",
    "lab.testDate": "Test date",
    "lab.enterOneMetric": "Enter at least one metric. Leave others blank.",
    "lab.detailedAnalysis": "Detailed analysis",
    "lab.comparativeAnalysis": "Comparative analysis",
    "lab.summaryTitle": "Summary",
    "lab.uploadViewOld": "Upload / view past results",

    // Lab form labels
    "lab.hba1c": "HbA1c (%)",
    "lab.hdl": "HDL (mg/dL)",
    "lab.ldl": "LDL (mg/dL)",
    "lab.triglycerides": "Triglycerides (mg/dL)",
    "lab.bpSystolic": "BP systolic (mmHg)",
    "lab.bpDiastolic": "BP diastolic (mmHg)",
    "lab.hba1cPlaceholder": "e.g. 6.5",
    "lab.hdlPlaceholder": "e.g. 55",
    "lab.ldlPlaceholder": "e.g. 100",
    "lab.trigPlaceholder": "e.g. 120",
    "lab.bpPlaceholder": "e.g. 120",

    // Lab table
    "lab.date": "Date",
    "lab.test": "Test",
    "lab.value": "Value",
    "lab.unit": "Unit",

    // Lab analysis
    "lab.good": "Good",
    "lab.attention": "Attention",
    "lab.high": "High",
    "lab.low": "Low",
    "lab.improved": "Improved",
    "lab.worsened": "Worsened",
    "lab.unchanged": "Unchanged",
    "lab.target": "Trend",
    "lab.prev": "Previous",
    "lab.latest": "Latest",

    // Report
    "report.title": "Doctor's Report",
    "report.subtitle": "Glucose, medications, lab results & Time-in-Range",
    "report.exportPdf": "Export to PDF",
    "report.exporting": "Exporting…",
    "report.bloodLabResults": "Blood lab results",
    "report.latestLabResults": "Latest blood lab results",
    "report.mostRecentPerTest": "Most recent value per test",
    "report.noLabData": "No lab data yet.",
    "report.timeInRange": "Time-in-Range summary",
    "report.tirHint": "% of readings in each zone (70–140 = healthy)",
    "report.hypo": "Below (<70)",
    "report.inRange": "In range (70–140)",
    "report.slightlyHigh": "Slightly high (141–180)",
    "report.high": "High (>180)",
    "report.noTirData": "No glucose data for TiR.",
    "report.combinedLog": "Combined log",
    "report.combinedLogHint": "Glucose readings and medication intake for clinician review",
    "report.dateTime": "Date & time",
    "report.type": "Type",
    "report.valueMedication": "Value / Medication",
    "report.notes": "Notes",
    "report.noData": "No data yet.",
    "report.glucose": "Glucose",
    "report.medication": "Medication",
    "report.comparativeLabSummary": "Comparative lab summary",

    // Chart
    "chart.hba1cTarget": "Dashed line: 7% (common target). 3–6 month view.",

    // Alerts (smart alerts)
    "alert.hypo": "Low blood sugar (hypoglycemia)",
    "alert.hypoDesc": "Seek immediate medical attention. Your reading is below 70 mg/dL (hypoglycemia).",
    "alert.hyper": "High blood sugar (hyperglycemia)",
    "alert.hyperDesc": "Your reading is above 180 mg/dL. Drink water and consult your doctor if this persists.",
  },
  tr: {
    "app.title": "OpenSugar – Kan Şekeri Takip",
    "dashboard.title": "OpenSugar",
    "dashboard.subtitle": "Kan şekeri ve ilaç takibi",
    "add.title": "Kayıt Ekle",
    "add.subtitle": "Şeker veya ilaç girişi",
    "add.glucoseCard": "Şeker ölçümü",
    "add.medicationCard": "İlaç girişi",
    "add.medicationCardHint": "İlacı ne zaman aldığınızı girin",
    "add.typeFasting": "Açlık",
    "add.typeAfterMeal": "Yemek Sonrası",
    "add.typeBedtime": "Yatmadan Önce",
    "add.typeOther": "Diğer",
    "nav.dashboard": "Panel",
    "nav.addEntry": "Kayıt Ekle",
    "nav.medications": "İlaçlar",
    "nav.lab": "Laboratuvar",
    "nav.report": "Rapor",
    "nav.signOut": "Çıkış",

    "lab.title": "Kan Tahlil Sonuçları",
    "lab.subtitle": "HbA1c, kolesterol, tansiyon",
    "lab.addResult": "Tahlil sonucu ekle",
    "lab.history": "Geçmiş",
    "lab.noResults": "Henüz tahlil yok. Yukarıdan ekleyin.",
    "lab.hba1cProgression": "HbA1c seyri",
    "lab.hba1cProgressionHint": "3–6 aylık trend (hedef genelde %7 altı)",
    "lab.saveLabResult": "Kaydet",
    "lab.saving": "Kaydediliyor…",
    "lab.saved": "Kaydedildi.",
    "lab.testDate": "Tahlil tarihi",
    "lab.enterOneMetric": "En az bir değer girin. Diğerlerini boş bırakabilirsiniz.",
    "lab.detailedAnalysis": "Detaylı analiz",
    "lab.comparativeAnalysis": "Karşılaştırmalı analiz",
    "lab.summaryTitle": "Özet",
    "lab.uploadViewOld": "Eski sonuçları ekle / görüntüle",

    "lab.hba1c": "HbA1c (%)",
    "lab.hdl": "HDL (mg/dL)",
    "lab.ldl": "LDL (mg/dL)",
    "lab.triglycerides": "Trigliserid (mg/dL)",
    "lab.bpSystolic": "Tansiyon sistolik (mmHg)",
    "lab.bpDiastolic": "Tansiyon diastolik (mmHg)",
    "lab.hba1cPlaceholder": "örn. 6.5",
    "lab.hdlPlaceholder": "örn. 55",
    "lab.ldlPlaceholder": "örn. 100",
    "lab.trigPlaceholder": "örn. 120",
    "lab.bpPlaceholder": "örn. 120",

    "lab.date": "Tarih",
    "lab.test": "Test",
    "lab.value": "Değer",
    "lab.unit": "Birim",

    "lab.good": "İyi",
    "lab.attention": "Dikkat",
    "lab.high": "Yüksek",
    "lab.low": "Düşük",
    "lab.improved": "İyileşti",
    "lab.worsened": "Kötüleşti",
    "lab.unchanged": "Değişmedi",
    "lab.target": "Trend",
    "lab.prev": "Önceki",
    "lab.latest": "Son",

    "report.title": "Doktor Raporu",
    "report.subtitle": "Şeker, ilaçlar, tahliller ve hedef aralık",
    "report.exportPdf": "PDF indir",
    "report.exporting": "İndiriliyor…",
    "report.bloodLabResults": "Kan tahlilleri",
    "report.latestLabResults": "Son kan tahlilleri",
    "report.mostRecentPerTest": "Test başına en son değer",
    "report.noLabData": "Henüz tahlil yok.",
    "report.timeInRange": "Hedef aralık özeti",
    "report.tirHint": "Ölçümlerin % dağılımı (70–140 = sağlıklı)",
    "report.hypo": "Düşük (<70)",
    "report.inRange": "Aralıkta (70–140)",
    "report.slightlyHigh": "Biraz yüksek (141–180)",
    "report.high": "Yüksek (>180)",
    "report.noTirData": "TiR için şeker verisi yok.",
    "report.combinedLog": "Birleşik kayıt",
    "report.combinedLogHint": "Klinisyen incelemesi için şeker ve ilaç kayıtları",
    "report.dateTime": "Tarih ve saat",
    "report.type": "Tür",
    "report.valueMedication": "Değer / İlaç",
    "report.notes": "Notlar",
    "report.noData": "Henüz veri yok.",
    "report.glucose": "Şeker",
    "report.medication": "İlaç",
    "report.comparativeLabSummary": "Karşılaştırmalı tahlil özeti",

    "chart.hba1cTarget": "Kesik çizgi: %7 (yaygın hedef). 3–6 ay görünümü.",

    "alert.hypo": "Düşük kan şekeri (hipoglisemi)",
    "alert.hypoDesc": "Acil tıbbi yardım alın. Ölçüm 70 mg/dL altında (hipoglisemi).",
    "alert.hyper": "Yüksek kan şekeri (hiperglisemi)",
    "alert.hyperDesc": "Ölçüm 180 mg/dL üzerinde. Su için ve sürerse doktorunuza danışın.",
  },
};

const STORAGE_KEY = "opensugar-locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "tr" || v === "en") return v;
  } catch {}
  return defaultLocale;
}

export function setStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
}

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
