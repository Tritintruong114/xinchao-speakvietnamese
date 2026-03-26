---
description: Quy trình phát triển tính năng mới (A2A Optimized: PRD -> API -> DB -> QC -> Docs)
---

# /create-feature SOP (A2A Version)

Quy trình này được thiết kế để các AI Agents phối hợp nhịp nhàng. **Mỗi tính năng phải có một thư mục riêng trong `brain/<feature-name>/` để chứa các artifact.**

## 1. Define PRD (Product Requirement Document)
- **Primary Agent:** `product-owner` + `uiux-designer`
- **Skills:** [PO SKILL](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/skills/product-owner/SKILL.md), [UIUX SKILL](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/skills/uiux/SKILL.md)
- **A2A Output (Artifact):** `brain/<feature-name>/srs.md`
  - **Required Content:** User Stories, Acceptance Criteria (Given/When/Then), Mobile UX Flow Map (Mermaid).

## 2. Define API Spec
- **Primary Agent:** `backend-ai` + `ai-engineer`
- **Skills:** [Backend SKILL](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/skills/backend/SKILL.md), [AI SKILL](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/skills/ai-engineer/SKILL.md)
- **Input:** `brain/<feature-name>/srs.md`
- **A2A Output (Artifact):** `brain/<feature-name>/api-spec.md`
  - **Required Content:** REST/Edge Function endpoints, Request/Response payloads (JSON Schema), AI Prompt Templates.

## 3. Define Database Schema
- **Primary Agent:** `backend-ai`
- **Skills:** [Backend SKILL](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/skills/backend/SKILL.md)
- **Input:** `brain/<feature-name>/api-spec.md`
- **A2A Output (Artifact):** `supabase/migrations/[timestamp]_feature_name.sql`
  - **Required Content:** DDL for tables/columns, **RLS Policies**, and Indexing.

## 4. QC Test Cases (Manual/Automation Prep)
- **Primary Agent:** `qa-engineer`
- **Skills:** [QA SKILL](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/skills/qa-engineer/SKILL.md)
- **Input:** `brain/<feature-name>/srs.md` + `brain/<feature-name>/api-spec.md`
- **A2A Output (Artifact):** `brain/<feature-name>/test-plan.md`
  - **Required Content:** Functional Test Matrix, Edge Case Scenarios, and API verification steps.

## 5. Documentations
- **Primary Agent:** `product-owner` + `mobile-frontend`
- **Reference:** [Design System](file:///Users/truongtritin/Github/xinchao%20-%20speak%20vietnamese/.agents/rules/design-system.md)
- **Input:** All artifacts in `brain/<feature-name>/`.
- **A2A Output (Artifact):** `brain/<feature-name>/walkthrough.md`
  - **Required Content:** Proof of work, screenshots/recordings, and mapping of features to User Stories.

---
*Ghi chú cho Agent: Luôn tạo thư mục `brain/<feature-name>/` trước khi bắt đầu và kiểm tra artifacts cũ tại đó.*
