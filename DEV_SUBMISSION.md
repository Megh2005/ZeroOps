---
title: "ZeroOps: Drag-and-Drop Cloud Architect & Reverse Terraform Engine"
published: true
tags: devchallenge, githubchallenge, devops, googlecloud, terraform
---

<!-- [COVER_IMAGE_PLACEHOLDER: Insert your cover image URL here] -->

*This is a submission for the [GitHub Finish-Up-A-Thon Challenge](https://dev.to/challenges/github-2026-05-21)*

## What I Built

**ZeroOps** is the ultimate visual playground for cloud infrastructure. It democratizes DevOps by providing a stunning, drag-and-drop canvas where anyone can architect Google Cloud Platform (GCP) solutions in minutes. 

It started as an idea to make cloud architecture less intimidating. Today, ZeroOps does three incredible things:
1. **Visual Architecting:** Drag and drop components (Cloud Run, Cloud SQL, VPCs, etc.), connect them, and instantly see real-time cost estimations.
2. **AI-Powered Terraform Generation:** With a single click, ZeroOps analyzes your visual architecture, validates it for security/best practices, and generates pristine, production-ready Terraform (HCL) code to provision it. It even offers cost-optimization suggestions!
3. **Code-to-Builder (Reverse Engineering):** Our unique selling point. Paste your existing Terraform code, and the AI will reverse-engineer it, instantly generating a beautiful visual diagram of your infrastructure.

This project means a lot to me because it bridges the gap between infrastructure visualization and actual deployment, making complex cloud engineering accessible to "laymen" and veterans alike.

## Demo

**Live Project URL:** <!-- [LIVE_PREVIEW_LINK_PLACEHOLDER: Insert your Vercel/production link here] -->

**Video Walkthrough:** <!-- [YOUTUBE_LINK_PLACEHOLDER: Insert your YouTube demo link here] -->

*(Screenshots)*
<!-- [SCREENSHOT_1_PLACEHOLDER: Insert image showing the visual canvas] -->
<!-- [SCREENSHOT_2_PLACEHOLDER: Insert image showing the Code-to-Builder interface] -->
<!-- [SCREENSHOT_3_PLACEHOLDER: Insert image showing the sliding Terraform code drawer] -->

## The Comeback Story

Before this challenge, ZeroOps had the skeleton of a drag-and-drop builder, but it lacked the polish and "killer features" needed to be truly useful. The Terraform output was trapped in a tiny, non-scrollable popup modal, the AI generation had issues with Markdown rendering inside code blocks, and the design felt generic.

During the Finish-Up-A-Thon, I completely overhauled the application:
- **Refined the UI:** I implemented a strict, formal, dark-glassmorphism aesthetic using the 'Outfit' font across the entire site for absolute uniformity.
- **Overhauled the Editor:** I replaced the cramped popup modal with a stunning, full-page dedicated Terraform viewer featuring a strict vertical layout, validation alerts, and smart cost-optimization tips.
- **Built the Ultimate USP:** I developed the "Code-to-Builder" feature from scratch, allowing users to paste raw Terraform and watch it magically transform back into a visual diagram.
- **Squashed Bugs:** Fixed tricky TypeScript errors, solved layout scrolling constraints, and tuned the Gemini AI prompts to strip out comments and markdown artifacts for pure HCL output.

## My Experience with GitHub Copilot

<!-- [COPILOT_EXPERIENCE_PLACEHOLDER: Write about how AI/Copilot helped you write boilerplate, catch bugs, suggest CSS Tailwind classes, or iterate on the Gemini integration] -->

GitHub Copilot was an invaluable pair programmer during this final sprint. It helped me rapidly scaffold the new `code-to-builder` page, confidently debug complex Flexbox and `min-h-0` layout constraints, and seamlessly integrate the `sessionStorage` routing logic. The ability to iterate on complex React state and Framer Motion animations with an AI assistant drastically reduced my time-to-completion, allowing me to focus on the core "wow" factor of the application rather than getting stuck on boilerplate.

---
<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->
<!-- Thanks for participating! -->
