export async function sendMessage(message: string, userId: string = "user-1"): Promise<string> {
    try {
        const res = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, user_id: userId }),
        });

        if (!res.ok) {
            throw new Error(`API error: ${res.statusText}`);
        }

        const data = await res.json();
        return data.response;
    } catch (error) {
        console.error("Failed to send message:", error);
        return "Sorry, I couldn't reach the career counsellor. Please ensure the backend is running.";
    }
}
