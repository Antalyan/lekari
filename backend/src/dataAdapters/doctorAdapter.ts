import { Review } from '@prisma/client';

const formatReviews = (reviews: Review[]) => {
  return reviews.map(function (review) {
    return {
      rate: review.rate / 2,
      comment: review.comment,
      author: review.author,
      createDate: review.created.toISOString()
        .split('T')[0],
      createTime: review.created.toLocaleTimeString()
    };
  });
};

export default { formatReviews };
