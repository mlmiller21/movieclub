import express from "express";
import request from "supertest";
import { server } from "../../app";
import { getConnection } from "typeorm";
//import {} from "../loaders/express"

let app: express.Application;

describe('Login a user', () => {
    beforeAll(async () => {
        app = await server();
    })
    afterAll(async () => {
        await getConnection().close();
    })
    
    it('Logging in with username', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
            usernameOrEmail: 'test',
            password: 'password'
        });

        expect(res.status).toEqual(200);
    })

    it('Logging in with email', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
            usernameOrEmail: 'test@test.ca',
            password: 'password'
        });

        expect(res.status).toEqual(200);
    })

    it('Username doesn\'t exist', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
            usernameOrEmail: 'testt',
            password: 'password'
        });

        expect(res.status).toEqual(400);
        expect(res.body.err.errors[0].message).toBe("username doesn't exist");
    })

    it('Email doesn\'t exist', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
            usernameOrEmail: 'test@test.com',
            password: 'password'
        });

        expect(res.status).toEqual(400);
        expect(res.body.err.errors[0].message).toBe("email doesn't exist");

    })

    it('Incorrect password', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
            usernameOrEmail: 'test',
            password: 'passwordd'
        });

        expect(res.status).toEqual(401);
        expect(res.body.err.errors[0].message).toBe("incorrect password");
    })
})