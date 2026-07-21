import { useEffect, useState } from "react";
import { lookupEntities } from "../api/lookup";
import { ApiError } from "../api/client";

// عمود الـ GUID الحقيقي وعمود الاسم لجدول الولايات بالـ Dataverse — مستخدم
// بصفحة التسجيل وبفورم تقديم الخدمات (alWilayaId لازم يكون GUID مش نص حر)
// الـ API بيرجع القيم مبنية على الـ alias (id/name) مش اسم الحقل الخام
export const AL_WILAYA_ID_FIELD = "id";
export const AL_WILAYA_NAME_FIELD = "name";

export function useAlWilayaOptions() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    lookupEntities({
      entityName: "ntw_alwilaya",
      columns: "ntw_alwilayaid:id,ntw_name:name",
    })
      .then((rows) => {
        if (!cancelled) setOptions(rows || []);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "generic");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { options, loading, error };
}
