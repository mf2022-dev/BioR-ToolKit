# National Biodefense Program — Document Framework

> **Program Name**: BioR — Biological Response Network  
> **Program Director**: Dr. Majed  
> **Document Version**: 1.0  
> **Date**: March 21, 2026  
> **Classification**: Internal — Program Development  

---

## Document Hierarchy

This program follows a **5-level resolution model** — from the highest strategic level (vision) down to the lowest technical level (code). Each level serves a different audience and a different purpose.

```
LEVEL 1 — VISION                        (Why)
    │
LEVEL 2 — PROGRAM PROPOSAL              (What)
    │
LEVEL 3 — PLATFORM DESIGN               (How)
    │
LEVEL 4 — WORKING PROTOTYPE (MVP)       (Proof)
    │
LEVEL 5 — CODE & INFRASTRUCTURE         (Implementation)
```

---

## Document Map

### Level 0 — Methodology (Audience: Program Director, Program Team)

| Doc ID | Document | Status | File |
|:------:|:---------|:------:|:-----|
| L0-00 | Program Framework (this document) | Done | [00_FRAMEWORK.md](00_FRAMEWORK.md) |
| L0-01 | Program Methodology — 5-Layer Framework | Done | [03_METHODOLOGY.md](03_METHODOLOGY.md) |

### Level 1 — Vision (Audience: National Decision-Makers)

| Doc ID | Document | Status | File |
|:------:|:---------|:------:|:-----|
| L1-01 | Problem Statement — Why Biodefense | Done | [01_PROBLEM_STATEMENT.md](01_PROBLEM_STATEMENT.md) |
| L1-02 | Program Definition — 5 Core Functions | Done | [02_PROGRAM_DEFINITION.md](02_PROGRAM_DEFINITION.md) |
| L1-03 | Current State Baseline (KSA) | Not Started | — |
| L1-04 | Executive Summary (1-pager) | Not Started | — |

### Level 2 — Program Proposal (Audience: Decision-Makers + Budget Authority)

| Doc ID | Document | Status | File |
|:------:|:---------|:------:|:-----|
| L2-01 | Program Scope & Objectives | Not Started | — |
| L2-02 | Stakeholder Map | Not Started | — |
| L2-03 | Organizational Structure | Not Started | — |
| L2-04 | Implementation Roadmap & Phases | Not Started | — |
| L2-05 | Budget Framework | Not Started | — |
| L2-06 | Risk Register | Not Started | — |
| L2-07 | Success Metrics & KPIs | Not Started | — |
| L2-08 | International Benchmarking | Not Started | — |

### Level 3 — Platform Design (Audience: Technical Reviewers)

| Doc ID | Document | Status | File |
|:------:|:---------|:------:|:-----|
| L3-01 | System Architecture | Partial | [/docs/GEOINTEL-ARCHITECTURE-PLAN.md](/docs/GEOINTEL-ARCHITECTURE-PLAN.md) |
| L3-02 | Data Model & Schema | Partial | SampleTrack: [DATABASE_SCHEMA.md] |
| L3-03 | Integration Architecture | Not Started | — |
| L3-04 | Security Architecture | Partial | SampleTrack: [SECURITY.md] |
| L3-05 | Technology Stack Decision | Done | In README |

### Level 4 — Working Prototype / MVP (Audience: "Show Me")

| Doc ID | Document | Status | File |
|:------:|:---------|:------:|:-----|
| L4-01 | Sprint 1 Review | Done | [/SPRINT_REVIEW_01.md](/SPRINT_REVIEW_01.md) |
| L4-02 | BioR Hub README | Done | [/README.md](/README.md) |
| L4-03 | SampleTrack README | Done | webapp: [/README.md] |
| L4-04 | Prototype Demo Guide | Not Started | — |

### Level 5 — Code & Infrastructure (Audience: Developer)

| Doc ID | Document | Status | File |
|:------:|:---------|:------:|:-----|
| L5-01 | BioR Hub Source Code | Done | `/home/user/bior-platform/src/` |
| L5-02 | SampleTrack Source Code | Done | `/home/user/webapp/src/` |
| L5-03 | Database Migrations | Done | `migrations/` in both projects |
| L5-04 | Infrastructure Config | Done | `wrangler.jsonc` in both projects |
| L5-05 | Deployment & Hosting | Done | [/HOSTING.md](/HOSTING.md) |

---

## Progress Summary

| Level | Documents | Done | Partial | Not Started |
|:------|:---------:|:----:|:-------:|:-----------:|
| L0 — Methodology | 2 | 2 | 0 | 0 |
| L1 — Vision | 4 | 2 | 0 | 2 |
| L2 — Proposal | 8 | 0 | 0 | 8 |
| L3 — Design | 5 | 1 | 3 | 1 |
| L4 — MVP | 4 | 3 | 0 | 1 |
| L5 — Code | 5 | 5 | 0 | 0 |
| **Total** | **28** | **13** | **3** | **12** |

**Completion: 13/28 done (46%), 3 partial, 12 not started**

---

## What This Tells Us

```
Level 5 (Code)      ██████████████████████████████  100% ← You are here
Level 4 (MVP)       ██████████████████████░░░░░░░░   75%
Level 3 (Design)    ████████████░░░░░░░░░░░░░░░░░░   40%
Level 2 (Proposal)  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    0% ← Decision-maker needs this
Level 1 (Vision)    ███████████████░░░░░░░░░░░░░░░░   50%
```

**Key Insight**: You built from the bottom up (code → MVP). The decision-maker reads from the top down (vision → proposal). The gap is in the middle — Level 2 (Program Proposal) is completely empty. This is the most important layer to build next.

---

## Reading Order

**For the Program Director (you)**: Read all levels, bottom to top — you built it this way.

**For the Decision-Maker**: Read Level 1 only. If interested, Level 2. Never below Level 3.

**For a Technical Reviewer**: Start at Level 3, verify with Level 4 (demo).

---

*This document is the master index. Update it as new documents are added.*
