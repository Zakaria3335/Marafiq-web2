import { apiFetch } from "./client";

// تفاصيل كرت خدمة واحدة (خطوات التنفيذ، الرسوم، الوقت المتوقع، الأهلية، المستندات المطلوبة)
export function getServiceCard(serviceId) {
  return apiFetch(`/api/v1/home-page/services-card/${serviceId}`);
}
