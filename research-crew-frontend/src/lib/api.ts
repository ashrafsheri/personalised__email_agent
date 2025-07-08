const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ResearchRequest {
    topic: string;
    current_year?: string;
    target_role?: string;
}

export interface EmailResponse {
    topic: string;
    current_year: string;
    email_content: string;
    research_summary: string;
    generated_at: string;
    processing_time_seconds: number;
    target_person?: string;
    target_role?: string;
}

export interface TaskResponse {
    task_id: string;
    status: string;
    message: string;
}

export interface TaskStatus {
    task_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    topic: string;
    current_year: string;
    target_role?: string;
    created_at: string;
    result?: any;
    error?: string;
    completed_at?: string;
}

// API Error class
export class ApiError extends Error {
    status: number;
    
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.detail || `HTTP error! status: ${response.status}`,
                response.status
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError(
                'Unable to connect to the server. Please make sure the backend is running on http://localhost:8000',
                0
            );
        }
        
        throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            0
        );
    }
}

// API functions
export const api = {
    // Health check
    async healthCheck(): Promise<{ message: string; version: string }> {
        return apiRequest('/');
    },

    // Generate email instantly (synchronous)
    async generateEmailInstant(request: ResearchRequest): Promise<EmailResponse> {
        return apiRequest('/research/instant', {
            method: 'POST',
            body: JSON.stringify({
                topic: request.topic,
                current_year: request.current_year || new Date().getFullYear().toString(),
                target_role: request.target_role,
            }),
        });
    },

    // Start background research task (asynchronous)
    async startResearchTask(request: ResearchRequest): Promise<TaskResponse> {
        return apiRequest('/research', {
            method: 'POST',
            body: JSON.stringify({
                topic: request.topic,
                current_year: request.current_year || new Date().getFullYear().toString(),
                target_role: request.target_role,
            }),
        });
    },

    // Get task status
    async getTaskStatus(taskId: string): Promise<TaskStatus> {
        return apiRequest(`/research/${taskId}`);
    },

    // Get task result
    async getTaskResult(taskId: string): Promise<EmailResponse> {
        return apiRequest(`/research/${taskId}/result`);
    },
};

// Helper function for easy use in components
export async function generateEmail(companyName: string, targetRole?: string): Promise<EmailResponse> {
    return api.generateEmailInstant({
        topic: companyName,
        current_year: new Date().getFullYear().toString(),
        target_role: targetRole,
    });
}

// Export default
export default api;