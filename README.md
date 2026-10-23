# GrainTrail

A deal tracker for maize brokers and buyers at the Kenya and Tanzania border. Log each deal, record grain quality, track every load from the border to the buyer, and keep payment records in one place. Built with FastAPI and Next.js.

**Status:** in design and early development. Nothing below is shipped until it is ticked in the roadmap.

## The problem

At border yards like Illasit, maize moves fast and on trust. Brokers lose money when a load is stopped over moisture, missing documents or overloading. Buyers wait without knowing where their truck is. Payments and quality disputes are settled by phone call and memory. GrainTrail gives every deal one shared record.

## Planned features

- Phone number and OTP login
- Identity verification with ID upload and a live selfie match
- Deal records with buyer, seller, bags, price and quality
- Moisture readings with photos
- Document checklist per load (phytosanitary certificate, certificate of origin, cess)
- Load status trail from loading to delivery, with SMS updates to the buyer
- Payment records with simulated escrow
- Claude assistant that updates deals from plain messages in English and Swahili
- Stop risk and price forecast models
- USSD access for feature phones
- Simulated GPS truck tracking on a map

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic |
| Data | PostgreSQL, Redis, MinIO |
| Jobs | Celery or ARQ |
| AI and ML | Claude API, scikit-learn, XGBoost, Prophet, InsightFace, MLflow |
| Messaging | Africa's Talking sandbox |
| Payments | M-Pesa Daraja sandbox |
| Tooling | Docker Compose, pytest, GitHub Actions |

## What is real and what is simulated

- Real: deal logic, status flow, OTP, ML pipelines, KYC pipeline
- Simulated: escrow (sandbox only, no real money), GPS tracking, ID checks (not checked against government records)
- Synthetic data: the stop risk and trust models are trained on generated data and labeled as such
- Public data: the price forecast uses public maize price data

## Project structure

```
backend/    FastAPI app, models, routers, services, tests
frontend/   Next.js app
docs/       Design documents
```

Full design: [docs/DESIGN.md](docs/DESIGN.md)

## Roadmap

- [x] Project design
- [ ] Backend skeleton, database, OTP login
- [ ] Deals, statuses and audit log
- [ ] Quality checks, documents and payment records
- [ ] Identity verification
- [ ] SMS, USSD and simulated escrow
- [ ] Claude assistant and document checker
- [ ] ML models
- [ ] Tracking map and dashboard
- [ ] Tests, CI, deployment and demo video

## Getting started

Setup instructions will be added with the first backend release.

## Privacy

Identity images are only collected with consent, used for verification and then deleted. Only test data is used in demos.

## Author

Isaac Tobiko, [GitHub](https://github.com/IsaacTobiko), [LinkedIn](https://linkedin.com/in/isaactobiko/)

## License

All rights reserved for now.# GrainTrail
