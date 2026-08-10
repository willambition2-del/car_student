# سجل الإصلاحات

- SEC-001 Critical Fixed: تفعيل Guards و@Roles عالميًا؛ الإثبات tests/build.
- SEC-002 Critical Fixed: reset password أصبح لهوية واحدة لا عدة مدارس.
- SEC-003 High Fixed: منع Platform user من tenant API.
- SEC-004 High Fixed: منع cross-tenant وmass assignment.
- SEC-005 High Fixed: refresh ذري مع userType وreuse detection.
- SEC-006 High Fixed: الدفع transaction/idempotency/recordedBy ومنع overpayment.
- SEC-007 High Partially Fixed: scope للمشرفة وآلة حالات؛ event ledger واختبارات أوسع باقية.
- SEC-008 Medium Fixed: منع تسريب 500 وquery في logs.
- SEC-009 High Partially Fixed: OTP محسن؛ Redis وقناة إرسال باقيان.
- SEC-010 High Partially Fixed: Flutter refresh/logout/routes/HTTPS؛ Mock باقٍ.
- SEC-011 High Not Fixed: GPS/Socket/FCM غير منفذة.
- SEC-012 High Not Fixed: Offline Sync وهمي.
- SEC-013 Medium Partially Fixed: Web refresh/logout؛ HttpOnly وsingle-flight باقيان.
- SEC-014 High Not Fixed: Mock Data واسعة ولم تحذف لتجنب كسر الواجهات.

لا migrations جديدة ولا تحديثات حزم.
