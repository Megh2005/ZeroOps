"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function debugTerraform(code: string): Promise<string> {
    if (!model) {
        return "Error: GEMINI_API_KEY is not set in the environment variables.";
    }

    const prompt = `You are an expert DevOps engineer and a Google Cloud Platform (GCP) Terraform specialist. 
  Please analyze the following Terraform code for errors, best practices (specifically for GCP), and security vulnerabilities. 
  Focus on the 'google cloude' and 'gcp' providers.
  Provide a corrected version of the code if necessary, and explain your changes.
  
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
    2. Dynamic Variables: The absence of hardcoded 'project_id', 'region', or specific 'constants' is NOT an error. It is a DESIGN CHOICE to make the code reusable. Ignore these as "errors" and focus on functional optimization.
    3. Ensure the code is syntactically correct and can be rendered visually.
    
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
            return JSON.parse(jsonString);
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
