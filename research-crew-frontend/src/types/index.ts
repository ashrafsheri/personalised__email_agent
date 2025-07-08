export interface EmailResponse {
    email: string;
}

export interface CompanyFormProps {
    onSubmit: (companyName: string) => void;
}

export interface EmailOutputProps {
    email: string;
}

export interface LoadingProps {
    isLoading: boolean;
}