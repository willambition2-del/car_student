# تدقيق Offline Sync

المزامنة الحالية StateProvider وMockData في الذاكرة. لا قاعدة محلية أو Queue أو batch endpoint أو backoff أو مصالحة تعارضات.

يلزم operationId فريد داخل المدرسة، تخزين دائم، acknowledgment قبل الحذف، retry مع jitter، state validation، واختبارات duplicate/restart/disconnect.

الحالة: NOT IMPLEMENTED ومانع لـStaging.
