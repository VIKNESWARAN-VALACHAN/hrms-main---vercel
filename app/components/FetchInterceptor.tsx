'use client';

import { useEffect } from 'react';

export default function FetchInterceptor() {
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (input, init = {}) => {
      const token = localStorage.getItem('hrms_token');
      const headers = new Headers(init.headers || {});
      
      // Get the URL to check if it's an S3 request
      const url = typeof input === 'string' ? input : 
                  input instanceof Request ? input.url : 
                  input.toString();
      
      // Don't add Authorization header for S3 URLs (they use presigned URLs for auth)
      const isS3Request = url.includes('.s3.') || url.includes('s3.amazonaws.com');
      
      if (token && !headers.has('Authorization') && !isS3Request) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return originalFetch(input, { ...init, headers });
    };

  }, []);

  return null;
} 