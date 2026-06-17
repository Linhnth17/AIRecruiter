namespace AIRecruiter.Infrastructure.Prompts;

public static class PromptTemplates
{
    public static string AnalyzeCV(string cvContent, string jobDescription) =>
        "You are an expert AI recruiter. Analyze the CV below and compare it STRICTLY with the Job Description.\n\n"
        + "IMPORTANT RULES:\n"
        + "- Only identify weaknesses that are DIRECTLY related to the Job Description requirements\n"
        + "- Do NOT mention skills or experience unrelated to the JD\n"
        + "- Base ALL analysis strictly on what the JD requires\n\n"
        + "JOB DESCRIPTION:\n"
        + jobDescription + "\n\n"
        + "CV:\n"
        + cvContent + "\n\n"
        + "Reply ONLY in the following JSON format, no extra text, no markdown:\n"
        + "{\n"
        + "  \"matchScore\": <0-100>,\n"
        + "  \"summary\": \"<2-3 sentence summary focused on JD fit>\",\n"
        + "  \"strengths\": \"<strengths relevant to JD, separated by |>\",\n"
        + "  \"weaknesses\": \"<weaknesses ONLY related to JD requirements, separated by |. If none, write 'None'>\",\n"
        + "  \"redFlags\": \"<red flags if any, separated by |. If none, write 'None'>\"\n"
        + "}";
    public static string GenerateInterviewQuestions(string cvContent, string jobDescription) =>
        "Based on the CV and Job Description below, generate 5 interview questions.\n"
        + "Mix technical and behavioral questions.\n\n"
        + "JOB DESCRIPTION:\n"
        + jobDescription + "\n\n"
        + "CV:\n"
        + cvContent + "\n\n"
        + "Reply ONLY in the following JSON format, no extra text, no markdown:\n"
        + "{\n"
        + "  \"questions\": [\"question 1\", \"question 2\", \"question 3\", \"question 4\", \"question 5\"]\n"
        + "}";

    public static string ExtractAndClassify(string cvContent, string jobList) =>
        "You are an expert AI recruiter. Analyze this CV and:\n"
        + "1. Extract candidate information accurately from the CV\n"
        + "2. Match with the most suitable Job Description from the list below\n\n"
        + "CV CONTENT:\n"
        + cvContent + "\n\n"
        + "AVAILABLE JOB DESCRIPTIONS:\n"
        + jobList + "\n\n"
        + "Reply ONLY in this JSON format, no extra text, no markdown:\n"
        + "{\n"
        + "  \"candidateInfo\": {\n"
        + "    \"name\": \"<full name extracted from CV>\",\n"
        + "    \"email\": \"<email extracted from CV>\",\n"
        + "    \"skills\": \"<skills separated by |>\",\n"
        + "    \"yearsOfExp\": <number>,\n"
        + "    \"summary\": \"<2-3 sentence professional summary>\"\n"
        + "  },\n"
        + "  \"bestMatchJobId\": \"<Id of best matching JD>\",\n"
        + "  \"matchScore\": <0-100>,\n"
        + "  \"matchSummary\": \"<explanation of why this JD matches best>\",\n"
        + "  \"strengths\": \"<candidate strengths separated by |>\",\n"
        + "  \"weaknesses\": \"<candidate weaknesses separated by |>\",\n"
        + "  \"redFlags\": \"<red flags if any, separated by |>\",\n"
        + "  \"questions\": [\"q1\", \"q2\", \"q3\", \"q4\", \"q5\"]\n"
        + "}";
}