import express from "express";
import request from "supertest";
import { server } from "../../app";
import { getConnection } from "typeorm";
//import {} from "../loaders/express"

let app: express.Application;

describe('Create a user', () => {
    beforeAll(async () => {
        app = await server();
    })
    afterAll(async () => {
        await getConnection().close();
    })
    
    it('Creating a new user', async () => {
        const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        expect(res.status).toEqual(201);
    })

    it('Creating a user that already exists', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });

        const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
            username: 'test',
            password: 'password',
            email: 'test@test.ca'
        });
        expect(res.status).toEqual(400);
        expect(res.body.err.errors).toHaveLength(2);
    })
})