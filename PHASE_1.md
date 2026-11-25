# Phase 1: Foundations & Core Trust Architecture
**FindMyHome Learning Milestone Baseline**

Welcome to **Phase 1** of your learning journey with **FindMyHome**! This document serves as your learning reference guide for this baseline codebase. (If you haven't yet, review [Phase 0: System Inception, Architecture & Environment Setup](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/PHASE_0.md) for prerequisites and environment setup).

---

## 🎯 What Phase 1 Covers

Phase 1 establishes the full-stack architectural baseline for a verified housing and roommate platform.

```
                  ┌─────────────────────────────────────────┐
                  │          React Frontend (Vite)          │
                  │  - Auth Context & Protected Routes      │
                  │  - Property Explorer (Masked Privacy)   │
                  │  - Interactive Stay Timeline Dashboard  │
                  └────────────────────┬────────────────────┘
                                       │ HTTP / REST (JWT)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Spring Boot 3 (Java 21) API       │
                  │  - SecurityFilterChain + JWT Auth Filter│
                  │  - Controller -> Service -> Repository  │
                  │  - Stay Finite State Machine (Dual-Ack) │
                  │  - Review Integrity Engine              │
                  └────────────────────┬────────────────────┘
                                       │ JPA / Hibernate
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │         PostgreSQL 17 Database          │
                  │  - Relational Schema with Constraints   │
                  │  - UNIQUE(stay_id, author_id, target)   │
                  └─────────────────────────────────────────┘
```

---

## 📚 Core Learning Concepts in Phase 1

### 1. Spring Boot 3 & Java 21 Backend
- **Project Structure**: Organized by feature/domain (`user`, `property`, `connection`, `stay`, `review`, `dispute`, `common`, `config`).
- **RESTful Architecture**: Clean separation across `*Controller`, `*Service`, `*Repository`, and Entity models.
- **Global Error Handling**: Standardized responses using [`ApiResponse<T>`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/common/ApiResponse.java) and [`GlobalExceptionHandler`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/common/GlobalExceptionHandler.java).
- **Security & JWT**: Stateless authentication via Spring Security 6, custom [`JwtAuthFilter`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/config/JwtAuthFilter.java), and role-based permissions (`ROLE_TENANT`, `ROLE_OWNER`).

### 2. Trust Domain Logic & State Machine
- **Privacy Gating**: Tenant and owner contact details/exact street addresses are masked until an owner accepts a connection request.
- **Stay State Machine (FSM)**:
  $$\text{REQUESTED} \longrightarrow \text{ACCEPTED} \xrightarrow{\text{Dual Move-In}} \text{ACTIVE} \xrightarrow{\text{Dual Move-Out}} \text{COMPLETED}$$
  Both tenant and owner must confirm move-in and move-out before a stay is marked `COMPLETED`.
- **Review Integrity**: Reviews cannot be submitted without an active or past stay, and duplicate reviews are blocked directly at the database layer via unique constraints.

### 3. Modern React Frontend
- **Vite & React 18**: Fast single-page application setup.
- **Tailwind CSS**: Utility-first styling with responsive layouts.
- **Context API**: Global state management for authentication (`AuthContext`).
- **Dynamic Views**: Public browse view vs. connected dashboard view.

### 4. Containerization & Orchestration
- Multi-container setup in [`docker-compose.yml`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/docker-compose.yml) linking PostgreSQL, Spring Boot backend, and React frontend.

---

## 🧭 Codebase Tour: Where to Look First

| Component | Key Files | What to Study |
|---|---|---|
| **Security Setup** | [`SecurityConfig.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/config/SecurityConfig.java)<br>[`JwtUtils.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/config/JwtUtils.java) | How requests are intercepted and tokens validated. |
| **Stay State Machine** | [`StayService.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/stay/StayService.java)<br>[`Stay.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/stay/Stay.java) | How dual confirmations and state transitions work. |
| **Review Integrity** | [`ReviewService.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/review/ReviewService.java)<br>[`Review.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/review/Review.java) | How stay validation and target rules prevent fake reviews. |
| **Integration Test** | [`FindMyHomeE2ETest.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/test/java/com/findmyhome/FindMyHomeE2ETest.java) | Full simulation from user registration to verified review. |
| **Frontend Auth & State** | [`AuthContext.jsx`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/frontend/src/context/AuthContext.jsx) | How JWT is persisted and injected into API calls. |

---

## 🧪 Hands-On Learning Exercises for Phase 1

1. **Run the End-to-End Test**:
   ```bash
   cd backend
   mvn test
   ```
   Inspect how Spring Boot spins up H2/PostgreSQL and executes the full stay lifecycle.

2. **Add a Field to Property**:
   Try adding `petFriendly` (boolean) or `furnishedStatus` to [`Property.java`](file:///Users/adityasinghbhadouria/Desktop/FindMyHome/backend/src/main/java/com/findmyhome/property/Property.java), update the DTO, and display it in the frontend card.

3. **Explore the Database**:
   With Docker running (`docker compose up`), connect to PostgreSQL:
   ```bash
   docker exec -it findmyhome-db psql -U postgres -d findmyhome
   \dt
   SELECT * FROM users;
   SELECT * FROM stays;
   ```

---

## 🗺️ What's Next in Phase 2

When you are ready to expand:
- **Real-Time Chat**: Socket.io / Spring WebSocket STOMP for live tenant-owner messaging.
- **Media Uploads**: Cloud storage (AWS S3 / Cloudinary) for property photo galleries.
- **Map View**: Leaflet / OpenStreetMap or Google Maps for geolocation browsing.
