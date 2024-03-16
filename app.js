import express from 'express';
import * as enterprisesService from './services/enterprisesService.js';
import { validateStringParam } from './utils.js';

const app = express();

// uncomment for local usage without cors error
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     next();
// });

app.use(express.json());

app.post('/enterprise/users/add', async (req, res) => {
    try {
        const { userHashes, taxId, permissions } = req.body;

        if (!userHashes || !Array.isArray(userHashes) || userHashes.length === 0) {
            return res.status(400).json({ error: 'userHashes parameter is missing or invalid' });
        }
        if (validateStringParam(taxId)) {
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

app.get('/enterprise/users', async (req, res) => {
    try {
        const { taxId } = req.query;
        if (validateStringParam(taxId)) {
            return res.status(400).json({ error: 'taxId parameter is missing or invalid' });
        }

        const users = await enterprisesService.getEnterprisesUsers(taxId);

        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting enterprise's users", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;