import {BlogPost} from './model.js';

const storageKey = 'blogPosts';

const postForm = document.querySelector('[data-testid="entity-form"]');
const postList = document.querySelector('[data-testid="entity-list"]');

let posts = loadPosts();

function loadPosts() {
  const storedPosts = localStorage.getItem(storageKey);

  if (!storedPosts) {
    return [];
  }

  try {
    const parsedPosts = JSON.parse(storedPosts);

    return parsedPosts.map(
      (post) =>
        new BlogPost(post.id, post.title, post.tags ?? [], post.comments ?? []),
    );
  } catch {
    return [];
  }
}

function savePosts() {
  localStorage.setItem(storageKey, JSON.stringify(posts));
}

function runAsync(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      resolve();
    }, 200);
  });
}

function createTagElement(post, tag) {
  const tagElement = document.createElement('span');
  tagElement.className = 'tag';

  const tagText = document.createElement('span');
  tagText.textContent = tag;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Удалить тег';
  removeButton.className = 'small-button';

  removeButton.addEventListener('click', async () => {
    await runAsync(() => {
      post.removeTag(tag);
      savePosts();
    });

    renderPosts();
  });

  tagElement.append(tagText, removeButton);

  return tagElement;
}

function createCommentElement(comment) {
  const commentElement = document.createElement('li');

  const author = document.createElement('strong');
  author.textContent = `${comment.author}: `;

  const text = document.createTextNode(comment.text);

  commentElement.append(author, text);

  return commentElement;
}

function createTagForm(post) {
  const form = document.createElement('form');
  form.className = 'inline-form';

  const label = document.createElement('label');
  label.textContent = 'Новый тег';

  const input = document.createElement('input');
  input.name = 'tag';
  input.type = 'text';
  input.required = true;

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Добавить тег';

  label.append(input);
  form.append(label, button);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const tag = input.value.trim();

    if (!tag) {
      return;
    }

    await runAsync(() => {
      post.addTag(tag);
      savePosts();
    });

    renderPosts();
  });

  return form;
}

function createCommentForm(post) {
  const form = document.createElement('form');
  form.className = 'comment-form';

  const authorLabel = document.createElement('label');
  authorLabel.textContent = 'Автор';

  const authorInput = document.createElement('input');
  authorInput.name = 'author';
  authorInput.type = 'text';
  authorInput.required = true;

  authorLabel.append(authorInput);

  const textLabel = document.createElement('label');
  textLabel.textContent = 'Комментарий';

  const textInput = document.createElement('input');
  textInput.name = 'text';
  textInput.type = 'text';
  textInput.required = true;

  textLabel.append(textInput);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Добавить комментарий';

  form.append(authorLabel, textLabel, button);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (!author || !text) {
      return;
    }

    await runAsync(() => {
      post.addComment({author, text});
      savePosts();
    });

    renderPosts();
  });

  return form;
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.dataset.testid = 'entity-card';

  const title = document.createElement('h2');
  title.textContent = post.title;

  const id = document.createElement('p');
  id.textContent = `ID: ${post.id}`;

  const tagsTitle = document.createElement('h3');
  tagsTitle.textContent = 'Теги';

  const tags = document.createElement('div');
  tags.className = 'tags';

  if (post.tags.length === 0) {
    tags.textContent = 'Тегов нет';
  } else {
    post.tags.forEach((tag) => {
      tags.append(createTagElement(post, tag));
    });
  }

  const commentsTitle = document.createElement('h3');
  commentsTitle.textContent = `Комментарии: ${post.commentCount}`;

  const comments = document.createElement('ul');
  comments.className = 'comments';

  if (post.comments.length === 0) {
    const emptyComment = document.createElement('li');
    emptyComment.textContent = 'Комментариев нет';
    comments.append(emptyComment);
  } else {
    post.comments.forEach((comment) => {
      comments.append(createCommentElement(comment));
    });
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Удалить пост';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.className = 'delete-button';

  deleteButton.addEventListener('click', async () => {
    await runAsync(() => {
      posts = posts.filter((currentPost) => currentPost.id !== post.id);
      savePosts();
    });

    renderPosts();
  });

  article.append(
    title,
    id,
    tagsTitle,
    tags,
    createTagForm(post),
    commentsTitle,
    comments,
    createCommentForm(post),
    deleteButton,
  );

  return article;
}

function renderPosts() {
  postList.replaceChildren();

  if (posts.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Постов пока нет.';
    postList.append(emptyMessage);

    return;
  }

  posts.forEach((post) => {
    postList.append(createPostCard(post));
  });
}

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(postForm);

  const id = Number(formData.get('id'));
  const title = String(formData.get('title')).trim();

  if (!title) {
    return;
  }

  await runAsync(() => {
    posts.push(new BlogPost(id, title));
    savePosts();
  });

  postForm.reset();
  renderPosts();
});

renderPosts();
