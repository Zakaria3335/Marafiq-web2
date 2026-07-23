import { apiFetch } from "./client";

// شكوى تسرب مياه (Water Leakage). OpsComplaintCategory هو تصنيف عام للشكوى
// (قيمة 1 = "Water Leakage"، مؤكدة — الصفحة كلها مخصصة لهاد التصنيف بس).
// OpsComplaintTypeForWaterLeakageComplaints هو نوع التسرب المحدد (dropdown
// الـ 6 خيارات: Leak in Water Meter/Main Pipeline/House Connection/...).
//
// StrSecurityCode/StrAnotherReason انشالوا من هون: الباك اند رجّع خطأ
// "Only OpsComplaintTypeForWaterLeakageComplaints may be set when category
// is Water Leakage" — يعني هدول الحقلين خاصين بتصنيف/تصنيفات تانية، ومحظور
// نبعتهن مع Water Leakage. حقول "Security Code"/"Another Reason" بالفورم
// هلق مش عم تنبعت للـ API — TODO: نسأل الـ backend وين المفروض تروح هاي
// القيم (أو نشيلها من الفورم لو مش مستخدمة أصلاً لهالنوع من الشكاوى)
//
// CaseTypeCode: 2 — مؤكد من رسالة validation حقيقية (Dataverse casetypecode
// بيقبل بس القيمة 2). CaseOriginCode: 1 غالباً "Web Portal" — تخمين لسا
// (مأخوذ من محاولة قديمة)، TODO تأكيده لو رجّع خطأ
const CATEGORY_WATER_LEAKAGE = 1;
const CASE_TYPE_CODE = 2;
const CASE_ORIGIN_CODE = 1;

// شكاوى المستخدم المسجّل دخوله (My Dashboard > Complaints)
export function getMyComplaints() {
  return apiFetch("/api/v1/cases/complaints");
}

// تفاصيل شكوى وحدة عن طريق رقم التذكرة — لسا ما في صفحة UI بتستخدمها
export function getComplaintDetails(ticketNumber) {
  return apiFetch(`/api/v1/cases/complaints/${ticketNumber}`);
}

export function submitWaterLeakageComplaint({
  accountNo,
  complaintTypeId,
  complaintDetails,
}) {
  return apiFetch("/api/v1/cases/complaints", {
    method: "POST",
    body: {
      AccountId: accountNo,
      OpsComplaintCategory: CATEGORY_WATER_LEAKAGE,
      OpsComplaintTypeForWaterLeakageComplaints: complaintTypeId,
      StrComplaintDetails: complaintDetails,
      CaseTypeCode: CASE_TYPE_CODE,
      CaseOriginCode: CASE_ORIGIN_CODE,
    },
  });
}
