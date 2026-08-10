# تدقيق الأسرار والإعداد

لم يظهر مفتاح حقيقي أو private key أو token. .env محلي ومتجاهل، و.env.example بلا أسرار وأضيف issuer/audience. docker-compose للتطوير فقط.

الإنتاج يحتاج secret manager وHTTPS وCORS محدد وSwagger غير عام ومفاتيح Maps مقيدة وحساب Firebase خارجي. لا يوجد Git history في نسخة العمل، ولم يُدّع تدوير سر.
