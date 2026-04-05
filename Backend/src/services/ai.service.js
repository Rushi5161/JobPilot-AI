const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `Generate an interview report for a candidate with the following details:
                            Resume: ${resume}
                            Self Description: ${selfDescription}
                            Job Description: ${jobDescription}

                            Respond with valid JSON only, matching this structure:
                            {
                                "matchScore": number,
                                "technicalQuestions": [{"question": string, "intention": string, "answer": string}],
                                "behavioralQuestions": [{"question": string, "intention": string, "answer": string}],
                                "skillGaps": [{"skill": string, "severity": "low"|"medium"|"high"}],
                                "preparationPlan": [{"day": number, "focus": string, "tasks": [string]}],
                                "title": string
                            }
        `

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        })

        const text = typeof response.text === "function" ? await response.text() : response.text
        const cleanedText = String(text).replace(/```json\n?|\n?```/g, "").trim()
        return JSON.parse(cleanedText)
    } catch (error) {
        console.error("AI Service Error:", error.response?.data || error)
        throw error
    }
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `Generate resume for a candidate with the following details:
                            Resume: ${resume}
                            Self Description: ${selfDescription}
                            Job Description: ${jobDescription}

                            Respond with valid JSON only in the form:
                            {
                              "html": "<html>...</html>"
                            }
                            The html value should include a complete resume layout suitable for PDF conversion.
        `

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        })

        const text = typeof response.text === "function" ? await response.text() : response.text
        const cleanedText = String(text).replace(/```json\n?|\n?```/g, "").trim()
        const jsonContent = JSON.parse(cleanedText)
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

        return pdfBuffer
    } catch (error) {
        console.error("AI Service Error:", error.response?.data || error)
        throw error
    }
}

module.exports = { generateInterviewReport, generateResumePdf }