const request = require('supertest');
const expect = require('chai').expect;

const BASE_URL = 'https://belajar-bareng.onrender.com';

describe('Automation Testing - Belajar Bareng', function () {
    let authToken = '';

// Login
    describe('POST /api/login', function () {
        it('Should successfully login and return JWT token', async function () {
            const loginPayload = {
                username: 'admin',
                password: 'admin'
            };

            const response = await request(BASE_URL)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send(loginPayload);

            // Assertions
            expect(response.status).to.equal(200);

            // Assertions Response Body 
            expect(response.body).to.have.property('status', 200);
            expect(response.body).to.have.property('message', 'Login successful');
            expect(response.body).to.have.property('token');
            expect(response.body.token).to.be.a('string').that.is.not.empty;

            // Buat simpan token
            authToken = response.body.token;
        });
    });

  // Add User
    describe('POST /api/add-user', function () {
        it('Should successfully add a new user with valid Bearer Token', async function () {
            // Cek token
            expect(authToken).to.be.a('string').that.is.not.empty;

            const addUserPayload = {
                username: 'bambangudinpurnomo',
                age: 23
            };

            const response = await request(BASE_URL)
                .post('/api/add-user')
                .set('Authorization', `Bearer ${authToken}`)
                .set('Content-Type', 'application/json')
                .send(addUserPayload);

            // Assertions 
            expect(response.status).to.equal(201);

            // Assertions
            expect(response.body).to.have.property('status', 201);
            expect(response.body).to.have.property('username', 'bambangudinpurnomo');
            expect(response.body).to.have.property('age', 23);
            expect(response.body).to.have.property('message', 'User successfully added, Hi bambangudinpurnomo!');
            expect(response.body).to.have.property('userId');
        });
    });
});