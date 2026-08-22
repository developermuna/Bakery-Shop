import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Plus, X, CheckCircle2 } from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  review: string;
  rating: number;
  date: string;
}

const MAX_REVIEW_CHARS = 120;

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Sarah M.",
    review:
      "The vanilla bean cloud cake was an absolute hit at our anniversary. Incredible texture and not overly sweet!",
    rating: 5,
    date: "19 August 2026",
  },
  {
    id: "rev-2",
    name: "David L.",
    review:
      "Best croissants in the city, period. The pickup process is so smooth, and everything is always perfectly boxed.",
    rating: 5,
    date: "15 August 2026",
  },
  {
    id: "rev-3",
    name: "Emily R.",
    review:
      "Ordered a custom cake for my daughter's 5th birthday. It was beautiful and tasted even better.",
    rating: 5,
    date: "11 August 2026",
  },
  {
    id: "rev-4",
    name: "Michael T.",
    review:
      "Found this bakery online and tried their signature bento cakes. The chocolate ganache is to die for!",
    rating: 5,
    date: "06 August 2026",
  },
  {
    id: "rev-5",
    name: "Jessica W.",
    review:
      "I love how easy it is to order ahead and just grab my box. The staff is always friendly and top-notch.",
    rating: 5,
    date: "01 August 2026",
  },
];

const formatCurrentFullDate = (dateObj: Date = new Date()): string => {
  const day = dateObj.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};

export const Reviews: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem("bento_user_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_REVIEWS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // Popup Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const nextReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviewsList.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviewsList.length - 1 : prevIndex - 1,
    );
  };

  useEffect(() => {
    if (isModalOpen) return; // pause auto-rotate while reviewing
    const timer = setInterval(() => {
      nextReview();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isModalOpen, reviewsList.length]);

  const getOffset = (index: number) => {
    let diff = index - currentIndex;
    const half = Math.floor(reviewsList.length / 2);
    if (diff > half) {
      diff -= reviewsList.length;
    } else if (diff < -half) {
      diff += reviewsList.length;
    }
    return diff;
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!reviewComment.trim()) {
      setFormError("Please share your feedback or review text.");
      return;
    }

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      rating: rating,
      review: reviewComment.trim(),
      date: formatCurrentFullDate(new Date()),
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem("bento_user_reviews", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsSubmittedSuccess(true);
    setCurrentIndex(0);

    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsModalOpen(false);
      setReviewerName("");
      setRating(5);
      setReviewComment("");
      setFormError("");
    }, 1200);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormError("");
    setIsSubmittedSuccess(false);
  };

  return (
    <section className="pt-4 pb-12 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-bento-text mb-2">
              Sweet Words
            </h2>
            <p className="text-base text-bento-text/90 max-w-xl font-bold">
              Don't just take our word for it. Here's what our community has to
              say.
            </p>
          </div>

          {/* Integrated Review Score & Add Review Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 bg-white/85 backdrop-blur-md p-1.5 pl-4 sm:pl-5 pr-2 rounded-full shadow-md border border-black/5 self-start md:self-auto">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="text-2xl font-serif font-bold text-bento-text">4.9</div>
              <div className="flex flex-col">
                <div className="flex text-bento-yellow space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-bento-text/70 font-semibold mt-0.5 whitespace-nowrap">
                  Based on {1240 + (reviewsList.length - INITIAL_REVIEWS.length)} reviews
                </span>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-black/10 mx-0.5" />

            {/* Integrated Pink Add Review Button */}
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 bg-strawberry hover:bg-strawberry/90 active:scale-95 text-white text-xs font-bold rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full width Carousel Container */}
      <div className="relative w-full overflow-hidden flex flex-col items-center">
        {/* Track */}
        <div className="relative w-full flex justify-center items-center h-[260px] md:h-[200px]">
          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20 p-3.5 bg-white hover:bg-bento-yellow hover:text-bento-text text-bento-text rounded-full transition-all duration-300 focus:outline-none flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 border border-black/5"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20 p-3.5 bg-white hover:bg-bento-yellow hover:text-bento-text text-bento-text rounded-full transition-all duration-300 focus:outline-none flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 border border-black/5"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {reviewsList.map((review, index) => {
            const offset = getOffset(index);
            const isActive = offset === 0;

            return (
              <motion.div
                key={review.id || index}
                initial={false}
                animate={{
                  x: `calc(${offset * 100}% + ${offset * 1.5}rem)`,
                  opacity: isActive ? 1 : 0.35,
                  scale: isActive ? 1 : 0.92,
                  zIndex: isActive ? 10 : 5 - Math.abs(offset),
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute w-[85vw] md:w-[45vw] lg:w-[40vw] h-full bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between cursor-pointer border border-black/5"
                onClick={() => !isActive && setCurrentIndex(index)}
              >
                <div>
                  <div className="flex space-x-1 mb-4 drop-shadow-xs">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = starValue <= review.rating;
                      return (
                        <Star
                          key={starValue}
                          className={`w-5 h-5 transition-colors ${
                            isFilled
                              ? "fill-bento-yellow text-bento-yellow"
                              : "fill-transparent text-bento-text/25 stroke-[1.5]"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-bento-text text-sm md:text-base font-serif italic mb-4 leading-snug line-clamp-2 h-[2.8rem] md:h-[3rem] overflow-hidden">
                    "{review.review}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 bg-strawberry text-white flex items-center justify-center rounded-full font-serif font-bold text-base shadow-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-bento-text text-sm md:text-base block">
                        {review.name}
                      </span>
                      {/* Formatted Date replacing Verified Customer */}
                      <span className="text-[11px] text-bento-text font-medium">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controls Container */}
        <div className="flex flex-col items-center mt-12 space-y-6">
          {/* Pagination Dots */}
          <div className="flex justify-center items-center space-x-3">
            {reviewsList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  index === currentIndex
                    ? "bg-bento-yellow w-8"
                    : "bg-bento-text/30 hover:bg-bento-text/50"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmittedSuccess && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-bento-text/50 hover:text-bento-text hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close review dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {isSubmittedSuccess ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-bold text-bento-text mb-2">
                    Review Submitted!
                  </h3>
                  <p className="text-xs text-bento-text">
                    Thank you for sharing your sweet moments with us.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-[11px] uppercase tracking-wider text-strawberry font-bold block mb-1">
                      Community Feedback
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-bento-text">
                      Write a Review
                    </h3>
                    <p className="text-xs text-bento-text mt-1">
                      Share your experience with our artisanal cakes and treats.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                        {formError}
                      </div>
                    )}

                    {/* Name Field */}
                    <div>
                      <label className="block text-xs font-semibold text-bento-text mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full bg-bento-text/5 border border-bento-text/10 focus:border-strawberry focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-bento-text placeholder:text-bento-text/40 focus:outline-none transition-all"
                        autoFocus
                      />
                    </div>

                    {/* Star Rating Picker (Default selected 5 stars) */}
                    <div>
                      <label className="block text-xs font-semibold text-bento-text mb-1.5">
                        Your Rating *
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-bento-text/5 p-2 rounded-xl border border-bento-text/10">
                          {[1, 2, 3, 4, 5].map((starValue) => {
                            const isFilled = (hoverRating !== null ? hoverRating : rating) >= starValue;
                            return (
                              <button
                                key={starValue}
                                type="button"
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(null)}
                                className="p-1 text-bento-yellow hover:scale-115 transition-transform"
                                aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    isFilled 
                                      ? "fill-bento-yellow text-bento-yellow" 
                                      : "fill-transparent text-bento-text/30 stroke-[1.5]"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs font-bold text-bento-text">
                          {rating === 5 && "5 / 5 - Exceptional"}
                          {rating === 4 && "4 / 5 - Very Good"}
                          {rating === 3 && "3 / 5 - Good"}
                          {rating === 2 && "2 / 5 - Fair"}
                          {rating === 1 && "1 / 5 - Poor"}
                        </span>
                      </div>
                    </div>

                    {/* Text Review Box (Limited to 2 lines / 120 chars) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-bento-text">
                          Your Review (Max 2 lines) *
                        </label>
                        <span className={`text-[11px] font-medium ${reviewComment.length >= MAX_REVIEW_CHARS ? 'text-red-500 font-bold' : 'text-bento-text'}`}>
                          {reviewComment.length}/{MAX_REVIEW_CHARS}
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        maxLength={MAX_REVIEW_CHARS}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write a concise 1-2 line review about taste, design, or pickup..."
                        className="w-full bg-bento-text/5 border border-bento-text/10 focus:border-strawberry focus:bg-white rounded-xl p-3 text-sm text-bento-text placeholder:text-bento-text/40 focus:outline-none transition-all resize-none leading-snug"
                      />
                    </div>

                    {/* Submission Date Preview Note */}
                    <div className="text-[11px] text-bento-text flex items-center justify-between pt-1">
                      <span>Review Date:</span>
                      <strong className="text-bento-text font-semibold">
                        {formatCurrentFullDate(new Date())}
                      </strong>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2.5 rounded-full text-xs font-semibold text-bento-text/70 hover:text-bento-text hover:bg-black/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-strawberry hover:bg-strawberry/90 active:scale-95 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

