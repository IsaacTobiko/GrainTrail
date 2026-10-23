# GrainTrail Design

## 1. Goal
A deal tracker for maize brokers and buyers at the Kenya and Tanzania border. One record per deal, from agreement to delivery. Portfolio project, so escrow, USSD, GPS and KYC are simulated and labeled as such.

## 2. Users and roles
- broker: creates and runs deals
- buyer: Kenyan miller or lorry trader, follows deals
- seller: Tanzanian trader or farmer
- transporter: driver or lorry owner
- admin: reviews KYC and disputes

## 3. Core flow
1. Sign up with phone and OTP (Tier 0)
2. Verify ID and selfie (Tier 1 and 2)
3. Broker creates a deal (parties, bags, price, quality)
4. Moisture reading and photo are attached
5. Document checklist is completed
6. Buyer pays a deposit (simulated escrow holds it)
7. Status moves along the load trail, buyer is notified at each step
8. Delivery confirmed, escrow releases the balance
9. Both sides rate each other

## 4. Deal status machine
ordered, loading, weighed, cleared, in_transit, delivered, closed.
stopped can be entered from loading, weighed, cleared or in_transit, and returns to the previous status when resolved.
Rule: cleared is blocked until all required documents are ticked.
Every change writes a status_event and an audit_log row.

## 5. KYC tiers
- Tier 0: OTP only, can browse
- Tier 1: ID front and back, OCR confirmed by user, deals up to a limit
- Tier 2: live selfie, face match and liveness, no limit and payments unlocked
- Low confidence goes to the admin review queue
- A KYCProvider interface lets us swap own pipeline for Smile ID sandbox
- Raw images deleted after verification, keep result, score and hash

## 6. Database tables
- users: id, phone, name, role, kyc_tier, is_active, created_at
- kyc_verifications: id, user_id, tier, status, face_score, reviewed_by, created_at
- kyc_documents: id, verification_id, doc_type, storage_key, ocr_json
- deals: id, broker_id, buyer_id, seller_id, bags, price_per_bag, quality_grade, status, border_point, created_at
- quality_checks: id, deal_id, moisture_percent, photo_key, checked_by, checked_at
- deal_documents: id, deal_id, doc_type, is_done, file_key, checked_at
- payments: id, deal_id, kind (deposit or balance), amount, mpesa_ref, status, created_at
- status_events: id, deal_id, status, note, actor_id, created_at
- stop_incidents: id, deal_id, reason, cost_estimate, resolved_at
- load_locations: id, deal_id, lat, lng, recorded_at
- prices: id, market, quality, buy_price, sell_price, date
- ratings: id, deal_id, rater_id, rated_id, score, comment
- notifications: id, user_id, channel, message, sent_at, status
- audit_logs: id, actor_id, action, entity, entity_id, ip, created_at
- ml_predictions: id, deal_id, model, score, features_json, created_at

## 7. API groups
- auth: POST /auth/otp/request, POST /auth/otp/verify, POST /auth/refresh
- users: GET /users/me, PATCH /users/me
- kyc: POST /kyc/id, POST /kyc/selfie, GET /kyc/status, GET /admin/kyc/queue, POST /admin/kyc/{id}/decision
- deals: POST /deals, GET /deals, GET /deals/{id}, POST /deals/{id}/status
- quality: POST /deals/{id}/quality
- documents: GET /deals/{id}/documents, PATCH /deals/{id}/documents/{doc_id}
- payments: POST /deals/{id}/payments, POST /payments/callback
- tracking: POST /deals/{id}/location, GET /deals/{id}/trail
- prices: GET /prices, POST /prices
- ratings: POST /deals/{id}/ratings
- ai: POST /ai/assistant, POST /ai/document-check, GET /ai/stop-risk/{deal_id}, GET /ai/price-forecast
- ussd: POST /ussd/callback
- health: GET /health

## 8. Architecture
Next.js (TypeScript) calls FastAPI over HTTPS.
FastAPI uses PostgreSQL for data, Redis for OTP, sessions, rate limits and pub/sub, and MinIO (S3 later) for private images.
Celery or ARQ workers handle SMS, OCR, face matching and model scoring.
External: Africa's Talking (SMS, USSD sandbox), M-Pesa Daraja sandbox, Claude API.
Models load once at startup and are served from the same FastAPI app.

## 9. AI and ML
- Claude assistant: free text like "Deal 12 weighed, moisture 14%" updates the deal, English and Swahili
- Document checker: reads a certificate photo, extracts fields, flags missing ones
- Face match and liveness: InsightFace plus OpenCV challenge frames
- Stop-risk model: XGBoost on synthetic data generated from documented rules, labeled synthetic
- Price forecast: Prophet on public KAMIS or FEWS NET maize prices
- Trust score: gradient boosting on synthetic deal history
- Tracking: MLflow for experiments and model versions

## 10. Security
- OTP rate limits, JWT in httpOnly cookies, short expiry with refresh
- Role checks on every endpoint
- Pydantic validation on all input
- Audit log on status, payment and KYC actions
- Secrets only in .env, never committed
- Encrypted private storage for images
- Consent screen before ID or selfie capture (Kenya Data Protection Act 2019)
- Short threat model in the README

## 11. Simulated and real
- Real: deal logic, statuses, OTP, SMS sandbox, ML models, KYC pipeline
- Simulated: escrow (Daraja sandbox), GPS (script posting coordinates), ID checks (not checked against IPRS or NIDA)
- Synthetic data: stop-risk and trust models

## 12. Repo layout
backend/app/main.py
backend/app/core (config, security, db)
backend/app/models
backend/app/schemas
backend/app/routers
backend/app/services (otp, kyc, escrow, assistant, ml)
backend/alembic
backend/tests
frontend (Next.js app router, components, lib/api)
docs/DESIGN.md
docker-compose.yml

## 13. Build phases
1. Skeleton, Postgres, OTP login, users
2. Deals, status events, audit log
3. Quality checks, documents, payments records
4. KYC pipeline and admin queue
5. SMS, USSD, simulated escrow
6. Claude assistant and document checker
7. Data generator, stop-risk, price forecast, trust score
8. GPS simulation, map, dashboard
9. Tests, Docker, CI, deploy, README, demo video

## 14. Out of scope
Open marketplace, real money handling, IPRS or NIDA lookups, moisture from photos.
