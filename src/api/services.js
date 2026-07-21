import { apiFetch } from "./client";

// كل الخدمات المعروضة بصفحة Services (عنوان/وصف بالعربي والإنجليزي، بدون صور)
export function getServices() {
  return apiFetch("/api/v1/home-page/services");
}

// طلب NOC (No Objection Certificate) — multipart/form-data لأنو في حقلين ملف
// (DrawingKrooki, NocLetterToMarafiq). لازم الـ FormData تتبنى بنفس أسماء
// الحقول متل ما هي بالـ curl: CompanyNameId, ProjectName, ApplicantNameId,
// ProjectLocation, ProjectType, FunctionalLocationId, SiteCondition
export function submitNocRequest(formData) {
  return apiFetch("/api/v1/services/noc", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

// طلب رخصة تعبئة صهاريج المياه — multipart/form-data لتلات حقول ملف
// (OwnerIdFile, TradeLicenseFile, VehicleOwnershipFile). أسماء الحقول متل
// الـ curl: VehicleInformation, GeographicArea, TankCapacity,
// TradeLicenseNumber, Phone, OperatorName, OperatorAddress, TankerType
export function submitTankerFillingLicenseRequest(formData) {
  return apiFetch("/api/v1/services/tanker-filling-license", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

// طلب توصيل خدمة المياه — multipart/form-data لعدة حقول ملف (PropertyCertificate,
// CommercialRegistration, SupportingDocuments, ServiceDeliveryRequest,
// ConstructionCompletionCertificate, ConstructionPermit, AreaDrawingKrooki).
// أسماء باقي الحقول متل الـ curl: NoOfMeters, SerialSketchNumber, PlotNumber,
// PlotPremiseId, Latitude, Longitude, RegionVillageId, LandNumber, AlWilayaId,
// LandArea, PremisesType, NoOfFloors
export function submitWaterConnectionRequest(formData) {
  return apiFetch("/api/v1/services/water-connection", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}
