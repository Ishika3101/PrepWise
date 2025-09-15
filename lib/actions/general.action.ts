import {db} from "@/firebase/admin";

export async function getInterviewsByUserId(userId: string) : Promise<Interview[] | null> {
    const interviews = await db
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy('createdAt','desc')
        .get();
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  }
  
  export async function getLatestInterviews (params: GetLatestInterviewsParams) : Promise<Interview[] | null> {
    const { userId, limit=20 } = params;
    const interviews = await db
        .collection("interviews")
        .orderBy('createdAt','desc')
        .limit(limit * 3) // Get more to filter out user's own interviews and non-finalized
        .get();
    
    // Filter in memory to avoid index requirements
    const filteredInterviews = interviews.docs
      .filter(doc => {
        const data = doc.data();
        return data.finalized === true && data.userId !== userId;
      })
      .slice(0, limit)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];
      
    return filteredInterviews;
  }

  export async function getInterviewById(id: string) : Promise<Interview | null> {
    const interviews = await db
        .collection("interviews")
        .doc(id)
        .get()
    return interview.data() as Interview | null;
  }