class Utilities {
  static analyzeSentiment(el) {
    if (el.hasClass('icon--review-positive')) {
      return 'positive';
    } else if (el.hasClass('icon--review-neutral')) {
      return 'neutral';
    } else if (el.hasClass('icon--review-negative')) {
      return 'negative';
    }
  }
  
  static getTotalNumberOfPages($) {
    const numberOfPages = Number($('.next_page').prev().text());
    return numberOfPages > 0 ? numberOfPages : 1;
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static isUnique(review, array) {
    let unique = true;
    for (let i = 0; i < array.length; i ++) {
      if (review.store_title === array[i].store_title && review.description === array[i].description && review.sentiment === array[i].sentiment) {
        unique = false;
        break;
      }
    }
    return unique;
  }
}

module.exports = Utilities;
