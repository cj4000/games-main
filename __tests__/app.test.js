const request = require('supertest');
const { app, setupApp } = require('../app'); // Import the app and setupApp
const fs = require('fs');
const path = require('path');
// Import your Player model and other necessary models here
// Import any other dependencies required for testing

const samplePlayer = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
};

const sampleGame = {
  title: 'Load Game',
  description: 'its a nice game for playing',
  image: ["img1.png", "img2.png"],
};

let server; // Declare a variable to store the server instance

beforeAll(async () => {
  server = await setupApp(3001); // Start the server and store the instance
});
afterAll((done) => {
  server.close((err) => {
    if (err) {
      console.error("Error while closing the server", err);
      done(err);
    } else {
      console.log('Server closed');
      done();
    }
  });
});


describe('Player Unit Test Cases', () => {


  it('should create a new player when hitting /players (POST)', async () => {
    const response = await request(app)
      .post('/players')
      .send(samplePlayer);
    expect(response.status).toBe(201);
    let res = JSON.parse(response.text);
    expect(res?.data?.user?.firstName).toBe(samplePlayer.firstName);
  });

  it('should respond with status 200 when hitting /players', async () => {
    const response = await request(app).get('/players');
    expect(response.status).toBe(200);
  });

  it('should get a player by ID', async () => {
    // Create a player and get its ID
    const player = await request(app)
      .post('/players')
      .send(samplePlayer)

    let res = JSON.parse(player.text);
    const response = await request(app)
      .get(`/players/${res?.data?.user?._id}`);

    res = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(res?.data?.player?.firstName).toBe(samplePlayer.firstName);
  });


  it('should update a player by ID', async () => {
    // Create a player and get its ID
    const player = await request(app)
      .post('/players')
      .send(samplePlayer)

    let res = JSON.parse(player.text);
    const updatedData = { firstName: 'UpdatedName' };
    const response = await request(app)
      .patch(`/player/${res?.data?.user?._id}`)
      .send(updatedData);

    res = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(res?.data?.player?.firstName).toBe(updatedData.firstName);
  });


  it('should delete a player by ID', async () => {
    // Create a player and get its ID
    const player = await request(app)
      .post('/players')
      .send(samplePlayer)

    let res = JSON.parse(player.text);
    const response = await request(app)
      .delete(`/player/${res?.data?.user?._id}`);

    expect(response.status).toBe(204);
  });

});

describe('Game Unit Test Cases', () => {


  it('should create a new game when hitting /games (POST)', async () => {

    // Read the test file to be attached as a Buffer
    const filePath = path.join(__dirname, 'test.png');
    const fileData = fs.readFileSync(filePath);

    const boundary = '----WebKitFormBoundary' + new Date().getTime();

    // Create a FormData object manually
    const formData = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${sampleGame.title}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\n${sampleGame.description}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="test-file.png"\r\nContent-Type: image/jpeg\r\n\r\n`),
      fileData,
      Buffer.from(`\r\n--${boundary}--`),
    ]);

    const response = await request(app)
      .post('/games')
      .set('Content-Type', `multipart/form-data; boundary=${boundary}`)
      .send(formData);

    expect(response.status).toBe(201);
    let res = JSON.parse(response.text);

    expect(res?.data?.Games?.title).toBe(sampleGame.title);


  });


  it('should respond with status 200 when hitting /games', async () => {
    const response = await request(app).get('/games');
    expect(response.status).toBe(200);
  });

  it('should get a game by ID', async () => {
    // Read the test file to be attached as a Buffer
    const filePath = path.join(__dirname, 'test.png');
    const fileData = fs.readFileSync(filePath);

    const boundary = '----WebKitFormBoundary' + new Date().getTime();

    // Create a FormData object manually
    const formData = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${sampleGame.title}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\n${sampleGame.description}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="test-file.png"\r\nContent-Type: image/jpeg\r\n\r\n`),
      fileData,
      Buffer.from(`\r\n--${boundary}--`),
    ]);

    const game = await request(app)
      .post('/games')
      .set('Content-Type', `multipart/form-data; boundary=${boundary}`)
      .send(formData);

    let res = JSON.parse(game.text);

    const response = await request(app)
      .get(`/games/${res?.data?.Games?._id}`);

    res = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(res?.data?.game?.title).toBe(sampleGame.title);
  });


  it('should update a game by ID', async () => {
    // Read the test file to be attached as a Buffer
    const filePath = path.join(__dirname, 'test.png');
    const fileData = fs.readFileSync(filePath);

    const boundary = '----WebKitFormBoundary' + new Date().getTime();

    // Create a FormData object manually
    const formData = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${sampleGame.title}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\n${sampleGame.description}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="test-file.png"\r\nContent-Type: image/jpeg\r\n\r\n`),
      fileData,
      Buffer.from(`\r\n--${boundary}--`),
    ]);

    const game = await request(app)
      .post('/games')
      .set('Content-Type', `multipart/form-data; boundary=${boundary}`)
      .send(formData);

    let res = JSON.parse(game.text);
    const updatedData = { title: 'UpdatedName' };
    // console.log(res?.data?.Games?._id)
    const response = await request(app)
      .patch(`/game/${res?.data?.Games?._id}`)
      .send(updatedData);

    res = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(res?.data?.game?.title).toBe(updatedData.title);
  });

  it('should delete a game by ID', async () => {
    // Read the test file to be attached as a Buffer
    const filePath = path.join(__dirname, 'test.png');
    const fileData = fs.readFileSync(filePath);

    const boundary = '----WebKitFormBoundary' + new Date().getTime();

    // Create a FormData object manually
    const formData = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${sampleGame.title}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\n${sampleGame.description}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="test-file.png"\r\nContent-Type: image/jpeg\r\n\r\n`),
      fileData,
      Buffer.from(`\r\n--${boundary}--`),
    ]);

    const game = await request(app)
      .post('/games')
      .set('Content-Type', `multipart/form-data; boundary=${boundary}`)
      .send(formData);

    let res = JSON.parse(game.text);
    const response = await request(app)
      .delete(`/game/${res?.data?.Games?._id}`);

    expect(response.status).toBe(204);
  });

});