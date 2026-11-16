# 01 — Project Overview

## Purpose

VidyaFloww is an **enterprise-grade AI-first school management platform** designed to unify every operational aspect of educational institutions — from admissions and academics to finance, HR, and AI-powered assistance — into a single, cohesive digital ecosystem.

## Vision

> *"Empower every school to operate with the efficiency of a world-class institution."*

VidyaFloww eliminates fragmented tools, paper-based workflows, and data silos. By providing a fully integrated platform across web, mobile, and desktop, we enable schools to focus on what matters most: education.

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Unified Platform** | One system for every function; no more juggling 10 different tools |
| **Multi-Tenant** | Support multiple organizations and campuses from a single deployment |
| **Desktop-First & AI-First** | High-density desktop workspace with integrated AI copilot and fluid typography |
| **AI-Augmented** | AI features enhance staff productivity through OCR, lesson generation, and risk prediction |
| **Offline-Capable** | Critical features must work in low or no connectivity environments |
| **Extensible** | Module-based architecture across 20 core institutional modules |

## Target Users

- **School Administrators** — Full platform control, reporting, and configuration
- **Principals & Academic Staff** — Academic management, attendance, examinations
- **Teachers** — Timetables, homework, attendance marking, gradebook
- **Students** — Learning management, schedules, results, communication
- **Parents** — Child progress tracking, fee payments, communication
- **Finance Teams** — Fee collection, invoicing, expense tracking
- **HR & Admin** — Staff management, payroll, leave management
- **IT Administrators** — Platform configuration, user management, audit logs

## Complete Documentation Catalog (`docs/`)

1. **`01-project-overview.md`** — System purpose, vision, and core principles
2. **`02-architecture.md`** — Monorepo system architecture & technology stack
3. **`03-folder-structure.md`** — Code organization rules across apps and packages
4. **`04-coding-standards.md`** — Code quality, TypeScript, and styling conventions
5. **`05-api-guidelines.md`** — REST/GraphQL & DRF API specifications
6. **`06-database-guidelines.md`** — Schema design, multi-tenancy, and indexing
7. **`07-permissions.md`** — Role-based access control (RBAC) matrix
8. **`08-module-development.md`** — Guide to building new platform modules
9. **`09-ui-guidelines.md`** — UI design system, fluid typography, border radius & drawers
10. **`10-git-workflow.md`** — Branching strategy and commit standards
11. **`11-deployment.md`** — Docker, CI/CD, and server infrastructure
12. **`12-roadmap.md`** — Implementation phases and feature release schedule
13. **`13-modules-specification.md`** — Detailed 20-module specification and architecture

## Technology Foundation

- **Backend**: Django 5 + DRF + PostgreSQL + Redis + Celery + Django Channels
- **Web**: React 19 + Vite + TypeScript + Tailwind CSS + TanStack Router
- **Mobile**: React Native + Expo + TypeScript
- **Desktop**: Electron + React + TypeScript
- **Monorepo**: TurboRepo + pnpm workspaces

---

*This document is maintained by the VidyaFloww Architecture Team.*
*Last updated: 2026-08-10*
