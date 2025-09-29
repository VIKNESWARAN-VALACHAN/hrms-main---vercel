'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '@/app/config';
import Link from 'next/link';

interface Attachment {
  name: string;
  url: string;
}

interface Reply {
  id: number;
  sender: string;
  timestamp: string;
  message: string;
  attachments: Attachment[];
}

interface Feedback {
  id: number;
  staff_id: number;
  section_id: number;
  category_id: number;
  feedback_type_id: number;
  status_id: number;
  description: string;
  attachments: Attachment[] | null;
  assigned_pic: string;
  escalation_level: number;
  submitted_at: string;
  updated_at: string;
  section_name: string;
  category_name: string;
  feedback_type_name: string;
  status_name: string;
  submitted_by: string;
  replies: Reply[];
}

export default function FeedbackDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);



  const fetchFeedback = useCallback(async () => {//async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/feedback/details/${id}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error('Failed to load feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [id]);//};

    useEffect(() => {
    if (!id) return;
    fetchFeedback();
  }, [id,fetchFeedback]);

  const handleReplySubmit = async () => {
    if (!reply.trim() || !feedback) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/feedback/respond/${feedback.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_message: reply,
          status_id: feedback.status_id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }

      setReply('');
      await fetchFeedback(); // Refresh the feedback data
    } catch (err) {
      console.error('Failed to submit reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadAttachment = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <Link href="/feedback/my-feedbacks" className="text-blue-500 underline mt-2 inline-block">
          ← Back to My Feedbacks
        </Link>
      </div>
    </div>
  );

  if (!feedback) return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p className="font-bold">Not Found</p>
        <p>Feedback not found.</p>
        <Link href="/feedback/my-feedbacks" className="text-blue-500 underline mt-2 inline-block">
          ← Back to My Feedbacks
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <Link href="/feedback/my-feedbacks" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to My Feedbacks
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Feedback Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-gray-900">{feedback.feedback_type_name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Section</p>
              <p className="text-gray-900">{feedback.section_name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Category</p>
              <p className="text-gray-900">{feedback.category_name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className={`font-medium ${
                feedback.status_name === 'Resolved' ? 'text-green-600' :
                feedback.status_name === 'Pending' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {feedback.status_name}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Submitted</p>
              <p className="text-gray-900">{formatDateTime(feedback.submitted_at)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-gray-900">{formatDateTime(feedback.updated_at)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Assigned PIC</p>
              <p className="text-gray-900">{feedback.assigned_pic}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Escalation Level</p>
              <p className="text-gray-900">Level {feedback.escalation_level}</p>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
            <div className="prose max-w-none text-gray-700">
              {feedback.description}
            </div>
          </div>

          {feedback.attachments && feedback.attachments.length > 0 && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-2">Attachments</p>
              <div className="flex flex-wrap gap-2">
                {feedback.attachments.map((attachment, index) => (
                  <button
                    key={index}
                    onClick={() => downloadAttachment(attachment.url, attachment.name)}
                    className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm truncate max-w-xs">{attachment.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Responses</h2>
          
          {feedback.replies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No responses yet
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.replies.map((reply) => (
                <div key={reply.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-blue-600">{reply.sender}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDateTime(reply.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{reply.message}</p>
                  
                  {reply.attachments.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {reply.attachments.map((attachment, idx) => (
                          <button
                            key={idx}
                            onClick={() => downloadAttachment(attachment.url, attachment.name)}
                            className="flex items-center px-2 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-100 text-xs"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {attachment.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {feedback.status_name !== 'Resolved' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Response</h2>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows={4}
              placeholder="Write your response here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className={`px-6 py-2 rounded-lg font-medium ${
                  !reply.trim() || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all'
                }`}
                onClick={handleReplySubmit}
                disabled={!reply.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}