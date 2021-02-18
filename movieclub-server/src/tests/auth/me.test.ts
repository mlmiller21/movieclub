import express from "express";
import request from "supertest";
import { server } from "../../app";
import { getConnection } from "typeorm";
import { User } from "../../entities/User";

let app: express.Application;

describe('Get logged in user', () => {
    beforeAll(async () => {
        app = await server();
    })
    afterAll(async () => {
        await getConnection().close();
    })
    
    it('me', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const user = await getConnection().getRepository(User).find({where: {username: 'test'}});

        const res = await request(app)
        .get('/api/v1/auth/me');

        console.log(res.body);

        expect(res.status).toEqual(200);
    })
})