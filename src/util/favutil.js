// src/util/favutil.js

export const getFavourites = () => {
  if (typeof window !== 'undefined') {
    const favourites = localStorage.getItem('favourites');
    return favourites ? JSON.parse(favourites) : [];
  }
  return [];
};

export const addFavourite = (product) => {
  if (typeof window !== 'undefined') {
    const favourites = getFavourites();
    favourites.push(product);
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }
};

export const removeFavourite = (docid) => {
  if (typeof window !== 'undefined') {
    let favourites = getFavourites();
    favourites = favourites.filter(product => product.docid !== docid);
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }
};

export const isFavourites = (docid) => {
  if (typeof window !== 'undefined') {
    const favourites = getFavourites();
    return favourites.some(product => product.docid === docid);
  }
  return false;
};
