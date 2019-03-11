export interface userProfile {
    email: string,
    displayName: string,
    phoneNumber: String,
    photoURL: string,
    providerId: string,
    uid: string
};
export interface appConfig {
    walkthrough: boolean,
    login: boolean,
    fcm: string,
};
export interface fireEmailUser {
    email: string,
    password: string
}