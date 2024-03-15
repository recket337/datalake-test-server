import express from 'express';
import * as enterprisesService from './services/enterprisesService.js';

const app = express();
app.use(express.json());

app.post('/enterprise/users/add', async (req, res) => {
    try {
        const { userHashes, taxId, permissions } = req.body;

        if (!userHashes || !Array.isArray(userHashes) || userHashes.length === 0) {
            return res.status(400).json({ error: 'userHashes parameter is missing or invalid' });
        }
        if (typeof taxId !== 'string' || !taxId.trim()) {
            return res.status(400).json({ error: 'taxId parameter is missing or invalid' });
        }
        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ error: 'permissions parameter is missing or invalid' });
        }

        await enterprisesService.addUsers(userHashes, taxId, permissions);

        res.status(200).json({ message: 'Users added to enterprise successfully' });
    } catch (error) {
        console.error('Error adding users to enterprise:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;