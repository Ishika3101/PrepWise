import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to avoid build-time issues
async function getCreateInterview() {
  try {
    const { createInterview } = await import('@/lib/actions/server-interview.action');
    return createInterview;
  } catch (error) {
    console.error('Failed to import createInterview:', error);
    return null;
  }
}

export async function GET() { 
    return NextResponse.json({ success: true, data: 'THANK YOU!' }, { status: 200 }); 
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, role, level, techstack, amount, userid } = body;

        console.log('Received interview generation request:', body);

        // Validate required fields
        if (!type || !role || !level || !techstack || !amount || !userid) {
            return NextResponse.json({ 
                success: false, 
                error: 'Missing required fields: type, role, level, techstack, amount, userid' 
            }, { status: 400 });
        }

        // Generate questions based on the parameters
        const questions = generateQuestions(role, level, techstack, parseInt(amount));

        // Create interview document in Firestore
        const interviewData = {
            type,
            role,
            level,
            techstack: Array.isArray(techstack) ? techstack : [techstack],
            questions,
            userId: userid,
            finalized: false
        };

        console.log('Creating interview with data:', interviewData);
        
        const createInterview = await getCreateInterview();
        if (!createInterview) {
            return NextResponse.json({ 
                success: false, 
                error: 'Failed to initialize interview service' 
            }, { status: 500 });
        }

        const result = await createInterview(interviewData);

        if (result.success) {
            console.log('Interview created successfully with ID:', result.interviewId);
            return NextResponse.json({ 
                success: true, 
                message: 'Interview generated successfully!',
                interviewId: result.interviewId,
                questions
            }, { status: 200 });
        } else {
            console.error('Failed to create interview:', result.error);
            return NextResponse.json({ 
                success: false, 
                error: result.error || 'Failed to create interview' 
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Internal server error' 
        }, { status: 500 });
    }
}

function generateQuestions(role: string, level: string, techstack: string, amount: number): string[] {
    // This is a simple question generator - you can enhance this based on your needs
    const baseQuestions = [
        `Tell me about your experience with ${techstack} in ${role} development.`,
        `How do you approach problem-solving in ${techstack} projects?`,
        `Describe a challenging ${techstack} project you've worked on.`,
        `What are the key differences between junior and ${level} ${role} developers?`,
        `How do you stay updated with the latest ${techstack} trends?`,
        `Explain your testing strategy for ${techstack} applications.`,
        `How do you handle performance optimization in ${techstack}?`,
        `Describe your experience with version control and collaboration in ${techstack} projects.`
    ];

    // Return the requested amount of questions, cycling through if needed
    const questions = [];
    for (let i = 0; i < amount; i++) {
        questions.push(baseQuestions[i % baseQuestions.length]);
    }

    return questions;
}