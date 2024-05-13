const request = require('supertest');
const app = require('../app');
const Post = require('../model/Post.model');
const User = require('../model/User.model');

describe('Blog API Endpoints', () => {
  let user;
  let token;
  let postId;

  beforeAll(async () => {
    // Create a test user for authentication
    user = await User.create({
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'test123',
    });

    // Authenticate user and obtain JWT token
    const response = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'test@example.com', password: 'test123' });
    token = response.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .attach('coverPhoto', 'test/image.jpg')
        .field('title', 'Test Post')
        .field('description', 'Description of test post')
        .field('tags', 'test, example')
        .field('body', 'Content of test post');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.post).toHaveProperty('_id');
      postId = response.body.post._id;
    });
  });

  describe('GET /api/posts', () => {
    it('should get all published posts', async () => {
      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.posts).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/posts/:postId', () => {
    it('should get a single published post', async () => {
      const response = await request(app)
        .get(`/api/posts/${postId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.post).toHaveProperty('_id', postId);
    });

    it('should increment the read count of the post', async () => {
      const postBefore = await Post.findById(postId);
      const response = await request(app)
        .get(`/api/posts/${postId}`);

      const postAfter = await Post.findById(postId);
      expect(postAfter.readCount).toBe(postBefore.readCount + 1);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/posts/invalidId');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('failed');
    });
  });

  describe('PUT /api/posts/:postId', () => {
    it('should update a post', async () => {
      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.post).toHaveProperty('title', 'Updated Title');
    });

    it('should return 401 if user is not the author of the post', async () => {
      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`) // Assuming the user is different from the author
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('DELETE /api/posts/:postId', () => {
    it('should delete a post', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Post deleted successfully');
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .delete('/api/posts/invalidId')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 if user is not the author of the post', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`); // Assuming the user is different from the author

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });
});
