import express from "express";
import request from "supertest";
import { server } from "../../app";
import { getConnection } from "typeorm";

let app: express.Application;

describe('Logout a user', () => {
    beforeAll(async () => {
        app = await server();
    })
    afterAll(async () => {
        await getConnection().close();
    })
    
    it('Logging out', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/logout')
        .send();

        expect(res.status).toEqual(200);
    })
})