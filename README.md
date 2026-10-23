# GrainTrail

Follow your grain from the border to the buyer.

GrainTrail is a deal tracker for maize brokers and buyers at the Kenya and Tanzania border. Log each deal, record grain quality, track every load from the border to the buyer, and keep payment records in one place. Built with FastAPI and Next.js.

## Why it exists

At border yards like Illasit, maize moves fast and on trust. A load stopped over moisture, missing papers or overloading can wipe out a broker's whole margin. Buyers wait for hours without knowing where their truck is. Payments and quality disputes are settled by phone call and memory. GrainTrail gives every deal one shared record that all sides can trust.

## What it does

**Deals**
- Create a deal with buyer, seller, bags, price per bag and quality grade
- Moisture readings with photos attached to every load
- Document checklist per load: phytosanitary certificate, certificate of origin and cess
- A load cannot be marked cleared until every required document is ticked

**Load trail**
- Status flow: ordered, loading, weighed, cleared, in transit, delivered, closed
- A stopped state with the reason and estimated cost
- SMS update to the buyer at every step
- Live truck position on a map

**Trust and identity**
- Phone number and OTP login
- Three verification tiers: OTP, ID upload with OCR, and live selfie with face match and liveness check
- Admin review queue for low confidence cases
- Ratings after every deal and a trust score for each user
- Full audit log of status, payment and verification actions

**Payments**
- Deposit and balance records with M-Pesa references
- Escrow that holds the deposit and releases the balance when delivery is confirmed

**AI and ML**
- Claude assistant: send "Deal 12 weighed, moisture 14%" and the deal updates, in English or Swahili
- Document checker: reads a certificate photo, extracts the fields and flags what is missing
- Stop risk model: scores how likely a load is to be stopped
- Price forecast: predicts border maize prices
- Trust score model: estimates default risk from deal history

**Feature phone access**
- USSD menu to check a deal, update a status and see today's prices

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic |
| Data | PostgreSQL, Redis, MinIO |
| Jobs | Celery |
| AI and ML | Claude API, scikit-learn, XGBoost, Prophet, InsightFace, OpenCV, MLflow |
| Messaging | Africa's Talking (SMS and USSD) |
| Payments | M-Pesa Daraja |
| Tooling | Docker Compose, pytest, GitHub Actions |

## Architecture

```
Next.js  ->  FastAPI  ->  PostgreSQL
                |-------> Redis (OTP, rate limits, live updates)
                |-------> MinIO (private ID and grain images)
                |-------> Celery workers (SMS, OCR, face match, scoring)
                |-------> Claude API
                |-------> Africa's Talking, M-Pesa Daraja
```

Models load once at startup and are served from the same API.

## Simulated and synthetic

Be clear about what is real and what is not:
- Escrow runs on the Daraja sandbox, so no real money moves
- GPS positions come from a script that simulates a truck
- ID checks are not matched against government records (IPRS or NIDA)
- The stop risk and trust models are trained on generated data built from documented rules
- The price forecast uses public maize price data

## Security

- OTP rate limits and short lived JWTs in httpOnly cookies
- Role checks on every endpoint
- Pydantic validation on all input
- Audit log for sensitive actions
- Private encrypted storage for identity images, deleted after verification
- Consent screen before any ID or selfie capture
- Secrets kept in environment files, never committed

## Project structure

```
backend/    FastAPI app, models, routers, services, tests
frontend/   Next.js app
docs/       Design documents
```

Full design: [docs/DESIGN.md](docs/DESIGN.md)

## Run locally

```bash
git clone git@github.com:IsaacTobiko/GrainTrail.git
cd GrainTrail
cp backend/.env.example backend/.env
docker compose up --build
```

Frontend runs on http://localhost:3000 and the API docs on http://localhost:8000/docs.

## Tests

```bash
cd backend
pytest
```

## Author

Isaac Tobiko
[GitHub](https://github.com/IsaacTobiko) | [LinkedIn](https://linkedin.com/in/isaactobiko/)

## License

All rights reserved.
