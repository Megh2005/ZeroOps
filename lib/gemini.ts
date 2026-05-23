"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
}

export async function debugTerraform(code: string): Promise<string> {
    if (!model) {
        return "Error: GEMINI_API_KEY is not set in the environment variables.";
    }

    const prompt = `You are an expert DevOps engineer and a Google Cloud Platform (GCP) Terraform specialist. 
  Please analyze the following Terraform code for errors, best practices (specifically for GCP), and security vulnerabilities. 
  Focus on the 'google cloude' and 'gcp' providers.
  
  CRITICAL GUIDELINES:
  1. Ignore any placeholder values (e.g., "YOUR_BACKEND_SERVICE", "enter your project id", "your-region"). Do NOT treat them as errors or invalid references.
  2. When generating the corrected code, DO NOT include any comments whatsoever.
  3. Ensure the corrected code is perfectly formatted with proper indentation (2 spaces) and strict, consistent line spacing/scheme.
  
  Format your response in structured Markdown.
  Use the following sections, and ensure each section starts with an H2 (##) header:
  
  ## Analysis
  [General analysis of the code]
  
  ## Security Risks
  [List any security vulnerabilities found]
  
  ## Best Practices
  [Suggestions for GCP best practices]
  
  ## Corrected Code
  [Provide the corrected Terraform code in a hcl code block]
  
  Terraform Code:
  \`\`\`hcl
  ${code}
  \`\`\`
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        return `Error debugging Terraform code: ${error.message}`;
    }
}

export async function getArchitecturalSuggestions(description: string): Promise<string> {
    if (!model) {
        return "Error: GEMINI_API_KEY is not set in the environment variables.";
    }

    const prompt = `You are an expert Google Cloud Architect. 
    The user needs help designing a cloud architecture on GCP.
    Based on the following description, suggest the best architectural patterns using Google Cloud services (e.g., Cloud Run, GKE, BigQuery, Pub/Sub, Cloud Functions, Spanner, etc.).
    Focus on modern, scalable, serverless, and secure practices on Google Cloud.

    FORMATTING REQUIREMENTS:
    1. Structure your response with clear headings (##).
    2. Use bullet points for key components.
    3. CRITICAL: Include a clear text-based diagram (ASCII Art) to visualize the architecture.
       - Use box-and-arrow style text diagrams.
       - Ensure it is enclosed in a code block.
       - Keep it simple, readable, and well-spaced.
       - Example:
       \`\`\`
    [User] -> [Load Balancer] -> [Cloud Run]
        |
        v
        [Cloud SQL]
    \`\`\`
    
    User Description:
    "${description}"
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        return `Error getting architectural suggestions: ${error.message}`;
    }
}

export async function validateTerraform(code: string): Promise<string> {
    if (!model) {
        return "Error: GEMINI_API_KEY is not set.";
    }

    const prompt = `You are a Terraform validation expert.
    Analyze the following Terraform code for correctness, syntax errors, and logical flaws.
    Return a short summary of the validation status.
    If it is correct, start with "✅ VALID".
    If there are errors, start with "❌ INVALID" and list them.
    
    CRITICAL: 
    - Do NOT consider missing values, or ANY placeholder strings (e.g. "YOUR_BACKEND_SERVICE", "your-project-id", etc.) as errors. Ignore them entirely.
    - ONLY check if the rest of the code is structurally valid.
    
    COST CHECK:
    - You must also quickly analyze if the resources could be cheaper (e.g., using a high-tier instance instead of e2-micro, not using spot instances where applicable).
    - If you strongly believe the code is NOT cost-optimized, include the exact string "COST_OPTIMIZATION_REQUIRED" anywhere in your response.
    
    Code:
    \`\`\`hcl
    ${code}
    \`\`\`
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        return `Validation failed: ${error.message}`;
    }
}

export async function optimizeTerraform(code: string): Promise<{ optimizedCode: string; tips: string }> {
    if (!model) {
        return { optimizedCode: code, tips: "Error: API Key missing." };
    }

    const prompt = `You are a Cloud Infrastructure Optimization expert and Terraform specialist.
    Analyze the following Terraform code and provide an OPTIMIZED, DEBUGGED version.
    
    GUIDELINES:
    1. Focus on cost-saving on Google Cloud (GCP): Suggest e2-micro, spot instances, lifecycle rules, etc.
    2. Dynamic Variables & Placeholders: The use of placeholders (like "YOUR_BACKEND_SERVICE", "your-project-id") is a DESIGN CHOICE. Do NOT treat them as errors.
    3. CRITICAL: DO NOT replace placeholders with actual values. Leave placeholders exactly as they are. Rather, work ONLY on the rest of the code to make it cost friendly.
    4. Code Formatting: The output optimized code MUST contain NO COMMENTS. It must be perfectly formatted using strict indentation (2 spaces) and proper line spacing.
    5. CRITICAL: DO NOT use markdown code blocks (e.g. \`\`\`hcl) inside the optimizedCode string. The optimizedCode MUST be pure, raw plain text.
    
    OUTPUT FORMAT:
    You MUST return a valid JSON object. Do not include any markdown formatting like \`\`\`json blocks in the actual response text, just the raw JSON.
    
    JSON Structure:
    {
      "optimizedCode": "The full, optimized Terraform HCL code as a single escaped string",
      "tips": "A markdown list of changes and cost-saving tips"
    }
    
    CRITICAL: Ensure all double quotes and newlines within the "optimizedCode" value are properly escaped so the JSON remains valid.
    
    CODE TO OPTIMIZE:
    ${code}
    `;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Robust JSON extraction: look for the first '{' and the last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            throw new Error("Could not find a valid JSON object in the AI response.");
        }

        const jsonString = text.substring(firstBrace, lastBrace + 1);

        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.optimizedCode) {
                // Strip any accidental markdown formatting the AI might have included
                parsed.optimizedCode = parsed.optimizedCode.replace(/^```[a-z]*\n/im, "").replace(/\n```$/im, "").trim();
            }
            return parsed;
        } catch (parseError) {
            console.error("Initial JSON parse failed, attempting cleanup:", jsonString);
            // Fallback: simple cleanup of common AI formatting mistakes
            const cleaned = jsonString
                .replace(/\\n/g, "\\n")
                .replace(/\\"/g, "\\\"")
                .replace(/[\u0000-\u001F]+/g, ""); // Remove control characters
            return JSON.parse(cleaned);
        }
    } catch (error: any) {
        console.error("Optimization error:", error);
        return {
            optimizedCode: code,
            tips: `Failed to optimize code due to a formatting error in the AI response. Error: ${error.message}`
        };
    }
}

export async function chatWithDevOpsBot(message: string, history: { role: "user" | "model", parts: { text: string }[] }[]): Promise<string> {
    if (!model) {
        return "Error: GEMINI_API_KEY is not set.";
    }

    const systemPrompt = `You are "ZeroOps Bot", an AI specialized in Google Cloud Platform (GCP) DevOps. 
    Your goal is to explain complex DevOps concepts to "laymen" or beginners in a clear, friendly, and to-the-point manner.
    
    GUIDELINES:
    1. Keep responses concise and focused. Avoid overwhelming the user with too much jargon.
    2. When using jargon, explain it simply (e.g., "CI/CD is like an automated assembly line for code").
    3. Focus specifically on GCP tools: Cloud Build, Artifact Registry, GKE, Cloud Run, Terraform (GCP Provider), Cloud Monitoring, etc.
    4. Stay in character as a helpful mentor.
    5. If a question is not about GCP or DevOps, politely steer the conversation back to those topics.
    6. Use Markdown for formatting (bolding, lists, code blocks).
    
    Current Task: The user is asking a question or follow-up. Answer it based on the previous conversation history provided.`;

    try {
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage([
            { text: systemPrompt },
            { text: message }
        ]);

        const response = await result.response;
        return response.text();
    } catch (error: any) {
        return `Error interacting with DevOps Bot: ${error.message}`;
    }
}
