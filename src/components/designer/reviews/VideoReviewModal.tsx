/**
 * @file VideoReviewModal.tsx
 * Modal for video review streaming, transcript reading, and direct reply authoring.
 */

import React, { useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  FileText,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { ReviewItem } from '../../../types/review.types';

interface VideoReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewItem | null;
  onOpenReply: (review: ReviewItem) => void;
}

export const VideoReviewModal: React.FC<VideoReviewModalProps> = ({
  isOpen,
  onClose,
  review,
  onOpenReply,
}) => {
  if (!isOpen || !review || !review.videoMetadata) return null;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const meta = review.videoMetadata;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101010] border border-[#2a2a2a] rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                Verified Video Proof Review
              </h2>
              <p className="text-xs text-gray-400">
                {review.author.name} • Order {review.orderNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-[#262626] group">
            <video
              ref={videoRef}
              src={meta.videoUrl}
              poster={meta.thumbnailUrl}
              className="w-full h-full object-cover"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          {/* Review Details & Ratings strip */}
          <div className="p-4 bg-[#161616] border border-[#222] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-amber-400 text-sm">
                  {'★'.repeat(review.overallRating)}
                </span>
                <span className="text-xs font-semibold text-white">{review.headline}</span>
              </div>
              <p className="text-xs text-gray-400">
                Garment: <strong className="text-gray-200">{review.garmentName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenReply(review);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors shadow-md shadow-amber-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Reply to Video Review</span>
              </button>
            </div>
          </div>

          {/* Transcript Viewer */}
          <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-400 border-b border-[#222] pb-2">
              <span className="font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Audio Transcription (AI Voice-to-Text)
              </span>
              <span className="text-[10px] text-gray-500">Duration: {meta.durationSeconds}s</span>
            </div>
            <p className="text-gray-200 leading-relaxed italic bg-black/40 p-3 rounded-lg border border-[#222]">
              "{meta.transcription}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
