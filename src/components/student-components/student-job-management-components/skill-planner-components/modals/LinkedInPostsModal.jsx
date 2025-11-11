import React from 'react';
import { toast } from 'react-hot-toast';

const LinkedInPostsModal = ({ isOpen, onClose, selectedSkill }) => {
  if (!isOpen || !selectedSkill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fab fa-linkedin text-white text-2xl"></i>
              <div>
                <h2 className="text-2xl font-bold text-white">LinkedIn Posts</h2>
                <p className="text-sm text-white opacity-90">{selectedSkill.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times text-white"></i>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {selectedSkill.linkedInPosts && selectedSkill.linkedInPosts.map((post) => (
            <div key={post.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <i className="fab fa-linkedin text-blue-600 text-3xl"></i>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{post.topic}</h3>
                  <p className="text-sm text-slate-500">{post.date}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="text-slate-700 whitespace-pre-wrap">{post.postText}</p>
              </div>
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.topic} className="w-full rounded-lg mb-4" />
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(post.postText);
                  toast.success('Post copied to clipboard!');
                }}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-copy"></i>
                Copy Post Text
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkedInPostsModal;
