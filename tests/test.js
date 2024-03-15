import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('POST /enterprise/users/add', () => {
    it('should return 400 if taxId is missing or invalid', async () => {
        const res = await request(app)
            .post('/enterprise/users/add')
            .send({
                userHashes: ['0xHash1', '0xHash2'],
                permissions: ['perm1', 'perm2']
            });
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('taxId parameter is missing or invalid');
    });

    it('should return 400 if userHashes is missing or invalid', async () => {
        const res = await request(app)
            .post('/enterprise/users/add')
            .send({
                taxId: '7162828483',
                permissions: ['perm1', 'perm2']
            });
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('userHashes parameter is missing or invalid');
    });

    it('should return 400 if permissions is missing or invalid', async () => {
        const res = await request(app)
            .post('/enterprise/users/add')
            .send({
                taxId: '7162828483',
                userHashes: ['0xHash1', '0xHash2']
            });
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('permissions parameter is missing or invalid');
    });

    it('should return 500 if there is an internal server error', async () => {
        const res = await request(app)
            .post('/enterprise/users/add')
            .send({
                taxId: '7162828483',
                userHashes: ['0xHash1', '0xHash2'],
                permissions: ['perm1', 'perm2']
            });
        expect(res.status).to.equal(500);
        expect(res.body.error).to.equal('Internal server error');
    });

    it('should return 200 and success message if request is valid', async () => {
        const res = await request(app)
            .post('/enterprise/users/add')
            .send({
                taxId: '7162828483',
                userHashes: ['0xHash1', '0xHash2'],
                permissions: ['perm1', 'perm2']
            });
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Users added to enterprise successfully');
    });
});
