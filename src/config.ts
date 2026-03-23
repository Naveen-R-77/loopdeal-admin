// Centralized configuration for the enterprise deployment
// Toggle between localhost for development and cloud URLs for production

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || "http://localhost:8000";
