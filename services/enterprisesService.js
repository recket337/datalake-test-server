import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

const getEnterpriseByTaxId = async (taxId) => {
    try {
        const query = 'SELECT * FROM enterprises WHERE tax_id = $1';
        const values = [taxId];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        throw new Error(`Failed to get enterprise by tax ID: ${error.message}`);
    }
};

const addUserToEnterprise = async (userHash, enterpriseId, permissions) => {
    try {
        const query = 'INSERT INTO user_enterprise_rl (user_id, enterprise_id) VALUES ($1, $2)';
        const values = [userHash, enterpriseId];
        await pool.query(query, values);
        console.log(`User with hash ${userHash} added to enterprise with ID ${enterpriseId}`);
        // I don't actually understand, what i need to do with permissions. 
    } catch (error) {
        throw new Error(`Failed to add user to enterprise: ${error.message}`);
    }
};

export const addUsers = async (userHashes, taxId, permissions) => {
    try {
        const enterprise = await getEnterpriseByTaxId(taxId);
        if (!enterprise) {
            throw new Error('Enterprise not found');
        }

        for (const userHash of userHashes) {
            await addUserToEnterprise(userHash, enterprise.enterprise_id, permissions);
        }
    } catch (error) {
        throw new Error(`Failed to add users to enterprise: ${error.message}`);
    }
};

export const getEnterprisesUsers = async (taxId) => {
    try {
        const enterprise = await getEnterpriseByTaxId(taxId);
        if (!enterprise) {
            throw new Error('Enterprise not found');
        }

        const query = `
            SELECT * FROM users
            JOIN user_enterprise_rl uer ON users.user_id = uer.user_id
            JOIN enterprises e ON uer.enterprise_id = e.enterprise_id
            WHERE e.tax_id = $1
        `;
        const values = [taxId];
        const result = await pool.query(query, values);
        
        return result.rows;
    } catch (error) {
        throw new Error(`Failed to get enterprise's users: ${error.message}`);
    }
}