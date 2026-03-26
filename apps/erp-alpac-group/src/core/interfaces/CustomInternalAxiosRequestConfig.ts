import type { InternalAxiosRequestConfig } from "axios";

export interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}