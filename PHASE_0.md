# Phase 0: System Inception, Architecture & Environment Setup
**FindMyHome Learning Milestone Baseline**

Welcome to **Phase 0** of your learning journey with **FindMyHome**! This document serves as your foundational onboarding guide, architectural blueprint, and environment setup reference before diving into the core implementation explored in [Phase 1](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/PHASE_1.md).

---

## 🎯 What Phase 0 Covers

Before writing a single line of application code or executing database queries, robust platforms require clear domain boundaries, an architectural blueprint, and a reproducible developer environment.

```
                    ┌──────────────────────────────────────────────┐
                    │          1. Problem Space & Vision           │
                    │   - Rental bias & bachelor safety            │
                    │   - Unverified & fabricated reviews          │
                    │   - Unrestricted contact & address leaks     │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         2. Architectural Blueprint           │
                    │   - Modular Monolith (Spring Boot 3 + Java 21│
                    │   - ACID Relational Guarantee (PostgreSQL 17)│
                    │   - Reactive SPA Frontend (React 18 + Vite)  │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │      3. Local Toolchain & Environment        │
                    │   - Java 21, Maven, Node.js 20+, Docker      │
                    │   - Docker Compose multi-container setup     │
                    │   - Automated baseline test verification     │
                    └──────────────────────────────────────────────┘
```

---

## 💡 The Problem Space & Core Value Proposition

Renting as a bachelor or student in metropolitan areas presents critical challenges that general-purpose real estate portals fail to solve:

1. **The Trust Deficit (Fake Reviews & Shills):**
   * Traditional housing boards allow anyone with an email address to post reviews. Unscrupulous landlords inflate ratings with fake praise, while disgruntled non-tenants leave retaliatory feedback.
   * **The FindMyHome Solution:** **Proof-of-Stay Verification**. Reviews cannot exist without a cryptographically recorded, dual-confirmed historical stay (`Stay` entity with `COMPLETED` status).

2. **Privacy Vulnerabilities (The "Broadcast" Problem):**
   * Standard portals immediately reveal the property owner's phone number and the exact flat address to the public internet, leading to unsolicited calls, broker poaching, and security risks for current occupants.
   * **The FindMyHome Solution:** **Privacy Gating via Handshake**. Public visitors only see locality-level masks (e.g., "Koramangala 4th Block, Bengaluru") and masked contact handles. Detailed street addresses and direct contact info unlock only after an owner accepts a verified connection request.

3. **Roommate & Bachelor Harmony:**
   * Finding compatible flatmates requires transparent expectations regarding lifestyle, gender preferences, and verification badges (`ID_VERIFIED`, `STUDENT_VERIFIED`, `BACKGROUND_CHECKED`).

---

## 🏛️ Technology Stack Selection Rationale

| Layer | Chosen Technology | Rationale & Alternatives Considered |
|---|---|---|
| **Language** | **Java 21 (LTS)** | Long-term support, modern Java features (Records for DTOs, Pattern Matching, Sequenced Collections, and Virtual Threads readiness for future I/O scaling). |
| **Backend Framework** | **Spring Boot 3.3.x** | Enterprise-grade ecosystem, robust Spring Security 6 filter chain, Spring Data JPA for declarative persistence, and zero-boilerplate REST architecture. |
| **Database** | **PostgreSQL 17** | Strict ACID guarantees, JSONB support for future flexibility, robust transaction isolation, and native composite unique constraints required to enforce the anti-fake review invariants. |
| **Frontend Framework** | **React 18 + Vite** | High-performance Single Page Application (SPA), lightning-fast Hot Module Replacement (HMR), and predictable unidirectional state management. |
| **Styling** | **Tailwind CSS 3** | Utility-first CSS providing responsive layouts, rapid prototyping, and compact production stylesheets. |
| **Security** | **Stateless JWT (HMAC-SHA256)** | Scalable, session-less authentication across client and API, enabling stateless horizontal scaling without distributed session stores. |
| **Containerization** | **Docker & Docker Compose** | Reproducible environment across developer machines (macOS, Linux, Windows) with identical PostgreSQL and networking semantics. |

---

## 📐 Domain Data Model & Entity Blueprints

The core domain model is structured around 6 foundational entities:

```
    ┌──────────────┐             1..* ┌───────────────────┐
    │     User     │─────────────────▶│     Property      │
    │ (Tenant/Host)│                  │ (Masked/Unmasked) │
    └──────┬───────┘                  └─────────┬─────────┘
           │ 1                                  │ 1
           │                                    │
           │ 1..*                               │ 1..*
    ┌──────▼───────────────┐          ┌─────────▼─────────┐
    │  ConnectionRequest   │          │       Stay        │
    │  (Privacy Handshake) │          │  (Dual-Ack FSM)   │
    └──────────────────────┘          └─────────┬─────────┘
                                                │ 1
                                                │
                                                │ 1..*
                                      ┌─────────▼─────────┐
                                      │      Review       │
                                      │ (Stay-Constrained)│
                                      └───────────────────┘
```

### Domain Entity Summary

1. [`User`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/user/model/User.java):
   * Represents tenants, flatmates, and property owners.
   * Stores credentials, roles (`ROLE_TENANT`, `ROLE_OWNER`, `ROLE_ADMIN`), and verification badges.
2. [`Property`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/property/model/Property.java):
   * Accommodations listed by owners.
   * Defines rent, security deposit, gender preferences, furnishing status, and public vs. private location fields.
3. [`ConnectionRequest`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/connection/model/ConnectionRequest.java):
   * Mediates the introduction between a prospective tenant and a property owner.
   * Statuses: `PENDING` $\rightarrow$ `ACCEPTED` / `REJECTED` / `CANCELLED`.
4. [`Stay`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/stay/model/Stay.java):
   * Represents legal, physical tenancy.
   * Requires mutual confirmation (handshake) for both move-in and move-out.
   * Statuses: `REQUESTED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `ACTIVE` $\rightarrow$ `COMPLETED` / `CANCELLED`.
5. [`Review`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/review/model/Review.java):
   * Immutable tenant and owner feedback tied to a completed `Stay`.
   * Enforces DB-level uniqueness: `UNIQUE (stay_id, author_id, target_type)`.
6. [`Dispute`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/dispute/model/Dispute.java):
   * Audited records for deposit withholding, damage claims, or covenant breaches.

---

## 🛠️ Developer Environment Prerequisites

Ensure the following tools are installed on your workstation:

| Requirement | Minimum Version | Verification Command |
|---|---|---|
| **Java Development Kit (JDK)** | Java 21 LTS | `java -version` |
| **Apache Maven** | 3.9.x | `mvn -version` |
| **Node.js** | 20.x LTS | `node -v` |
| **npm** | 10.x | `npm -v` |
| **Docker Engine & Compose** | Docker 24+ / Compose v2+ | `docker compose version` |

### Service Port Map

| Port | Service | Access Point | Default Credentials |
|---|---|---|---|
| **5432** | PostgreSQL 17 Database | `localhost:5432` | user: `postgres`, pass: `password`, db: `findmyhome` |
| **8080** | Spring Boot API | `http://localhost:8080/api/v1` | Context root: `/api/v1` |
| **5173** | React Dev Server (Vite) | `http://localhost:5173` | Proxies `/api/v1` to `localhost:8080` |
| **3000** | React Container (Nginx) | `http://localhost:3000` | Production container build |

---

## 🚀 Onboarding & Verification Guide

Follow these steps to initialize and verify the baseline workspace:

### 1. Verify Repository Workspace

Ensure your root directory matches the expected project structure:

```bash
cd FindMyHome
ls -la
# Expected: backend, frontend, docker-compose.yml, README.md, PHASE_1.md
```

### 2. Verify Backend Build & Tests

Run Maven from the backend root to compile and run tests against the in-memory/test configuration:

```bash
cd backend
mvn clean test
```

Expected output:
```
[INFO] BUILD SUCCESS
[INFO] Total time: ...
```

### 3. Verify Frontend Dependencies & Build

Install packages and verify production bundling:

```bash
cd ../frontend
npm install
npm run build
```

Expected output:
```
✓ built in ...ms
dist/index.html
dist/assets/index-*.css
dist/assets/index-*.js
```

### 4. Running the Entire Stack via Docker Compose

To start all services simultaneously with isolated networking:

```bash
# In the repository root
docker compose up --build -d

# Check service status
docker compose ps
```

Verify service availability:
- **Frontend SPA:** Open [http://localhost:3000](http://localhost:3000)
- **API Health / Endpoints:** `curl http://localhost:8080/api/v1/properties`
- **PostgreSQL Connection:**
  ```bash
  docker exec -it findmyhome-db psql -U postgres -d findmyhome -c "\dt"
  ```

---

## 🧭 Transitioning to Phase 1

With Phase 0 complete and your environment verified:
* Proceed directly to [**Phase 1: Foundations & Core Trust Architecture**](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/PHASE_1.md).
* Explore the implementation of the **Stay State Machine**, **Stateless JWT Security**, and the **Verified Review Constraints**.
