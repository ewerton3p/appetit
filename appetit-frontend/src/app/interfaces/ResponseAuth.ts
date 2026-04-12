export interface ResponseAuth {
    accessToken: string;
    refreshToken: string;
    expiration: Date;
    success: boolean;
    message: string;
}