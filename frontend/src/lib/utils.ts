import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return 'https://placehold.co/600x400?text=No+Image'; // Default placeholder
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Get base URL from environment or default
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const baseUrl = apiUrl.replace('/api/v1', '');

  // Normalize path: remove leading slash
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // If path starts with 'storage/' or 'uploads/', it already has the correct segment
  if (cleanPath.startsWith('storage/') || cleanPath.startsWith('uploads/')) {
    return `${baseUrl}/${cleanPath}`;
  }

  return `${baseUrl}/storage/${cleanPath}`;
}
