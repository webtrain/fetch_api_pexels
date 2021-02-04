class PhotoGallery {
  constructor() {
    this.API_KEY = 'api_key';
    this.galleryDiv = document.querySelector('.gallery');
    this.searchForm = document.querySelector('header form');
    this.loadMore = document.querySelector('.load-more');
    this.logo = document.querySelector('.logo');
    this.pageIndex = 1;
    this.searchValueGlobal = '';
    this.eventHandle();
  }

  eventHandle() {
    document.addEventListener('DOMContentLoaded', () => {
      this.getImg(1);
    });
    this.searchForm.addEventListener('submit', (e) => {
      this.getSearchedImages(e);
      this.pageIndex = 1;
    });
    this.loadMore.addEventListener('click', (e) => {
      this.loadMoreImages(e);
    });
    this.logo.addEventListener('click', () => {
      this.pageIndex = 1;
      this.galleryDiv.innerHTML = '';
      this.getImg(this.pageIndex);
    });
  }

  async getImg(index) {
    this.loadMore.setAttribute('data-img', 'curated');
    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.generateHTML(data.photos);
  }

  async fetchImages(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.API_KEY,
      },
    });

    const data = await response.json();
    console.log(data);
    return data;
  }

  generateHTML(photos) {
    photos.forEach((photo) => {
      const item = document.createElement('div');
      item.classList.add('item');
      item.innerHTML = `
        <div class="item">
          <a href="${photo.src.original}" target="_blank">
            <img src="${photo.src.medium}" alt="img">
            <h3>${photo.photographer}</h3>
          </a>
        </div>
      `;
      this.galleryDiv.appendChild(item);
    });
  }

  async getSearchedImages(e) {
    this.loadMore.setAttribute('data-img', 'search');
    e.preventDefault();
    this.galleryDiv.innerHTML = '';
    const searchValue = e.target.querySelector('input').value;
    this.searchValueGlobal = searchValue;
    const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.generateHTML(data.photos);
    e.target.reset();
  }

  async getMoreSearchedImages(index) {
    const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    console.log(data);
    this.generateHTML(data.photos);
  }

  loadMoreImages(e) {
    e.preventDefault();
    let index = ++this.pageIndex;
    const loadMoreData = e.target.getAttribute('data-img');

    if (loadMoreData === 'curated') {
      // Load page 2 for curated
      this.getImg(index);
    } else {
      // load page 2 for search
      this.getMoreSearchedImages(index);
    }
  }
}

const gallery = new PhotoGallery();
