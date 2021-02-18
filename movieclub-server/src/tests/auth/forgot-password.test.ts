import { ForgotPassword } from "../../entities/ForgotPassword";
import { User } from "../../entities/User";

import { server } from "../../app";

import express from "express";
import request from "supertest";
import { getConnection } from "typeorm";
import { v4 } from "uuid";

let app: express.Application;

describe('Forgot password', () => {
    beforeAll(async () => {
        app = await server();
    })
    afterAll(async () => {
        await getConnection().close();
    })
    
    it('Sending an email token and using that to reset password', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });
        
        const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
            email: 'test@test.ca'
        });

        const user = await getConnection().getRepository(User).findOne({where: {username: 'test'}});
        const token = await getConnection().getRepository(ForgotPassword).findOne({where: {userid: user!.id}});

        const res2 = await request(app)
        .post('/api/v1/auth/change-password')
        .send({
            password: 'newpassword',
            token: token!.token
        });

        const res3 = await request(app)
        .post('/api/v1/auth/login')
        .send({
            usernameOrEmail: 'test',
            password: 'newpassword'
        });

        expect(res.status).toEqual(201);
        expect(res2.status).toEqual(200);
        expect(res3.status).toEqual(200);
    })

    it('Forgot password for inexistent user', async () => {
        const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
            email: 'test2@test.ca'
        });

        expect(res.status).toEqual(404);
        expect(res.body.err.errors[0].message).toBe("User doesn't exist");  
    })

    it('Forgot password token already generated', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({
            email: 'test@test.ca'
        });

        expect(res.status).toEqual(400);
        expect(res.body.err.errors[0].message).toBe('A token has already been generated for that account');
    })

    it('Token doesn\'t exist', async () => {
        const res = await request(app)
        .post('/api/v1/auth/change-password')
        .send({
            password: 'newpassword',
            token: v4()
        });

        expect(res.status).toEqual(404);
        expect(res.body.err.errors[0].message).toBe('Token expired');
    })
})