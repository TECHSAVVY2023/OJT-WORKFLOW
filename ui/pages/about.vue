<template>
  <div class="min-h-screen bg-white font-poppins">
    <AboutPageIntro :site-data="siteData" />
    <AboutCommunitySays
      :site-data="siteData"
      :all-reviews="allReviews"
      :max-review-images="MAX_REVIEW_IMAGES"
      :write-review-modal-open="writeReviewModalOpen"
      :show-publish-confirm="showPublishConfirm"
      :new-review="newReview"
      :submit-success="submitSuccess"
      :current-review-index="currentReviewIndex"
      :current-review="currentReview"
      :image-modal-src="imageModalSrc"
      :review-initials="reviewInitials"
      :format-rating="formatRating"
      :format-review-date="formatReviewDate"
      :upload-input-ref="uploadInputRef"
      :review-carousel-ref="reviewCarouselRef"
      @update:write-review-modal-open="writeReviewModalOpen = $event"
      @update:show-publish-confirm="showPublishConfirm = $event"
      @update:current-review-index="currentReviewIndex = $event"
      @update:image-modal-src="imageModalSrc = $event"
      @update:new-review="newReview = $event"
      @prev-review="prevReview"
      @next-review="nextReview"
      @review-touch-start="onReviewTouchStart"
      @review-touch-end="onReviewTouchEnd"
      @image-select="onImageSelect"
      @profile-image-select="onProfileImageSelect"
      @remove-review-image="removeReviewImage"
      @close-write-review-modal="closeWriteReviewModal"
      @confirm-publish-review="confirmPublishReview"
    />
  </div>
</template>

<script setup lang="ts">
const { siteData } = useAboutPage()
const {
  allReviews,
  MAX_REVIEW_IMAGES,
  writeReviewModalOpen,
  showPublishConfirm,
  newReview,
  uploadInputRef,
  submitSuccess,
  currentReviewIndex,
  currentReview,
  imageModalSrc,
  reviewCarouselRef,
  reviewInitials,
  formatRating,
  formatReviewDate,
  prevReview,
  nextReview,
  onReviewTouchStart,
  onReviewTouchEnd,
  onImageSelect,
  onProfileImageSelect,
  removeReviewImage,
  closeWriteReviewModal,
  confirmPublishReview,
} = useAboutCommunitySays()
</script>
