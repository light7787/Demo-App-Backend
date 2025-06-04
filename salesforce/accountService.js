const { getConnection } = require('./connection');

class AccountService {
  static async getAccounts(limit = 5) {
    const conn = await getConnection();
    const result = await conn.query(
      `SELECT Id, Name, Industry, Phone, Website, AnnualRevenue FROM Account ORDER BY CreatedDate DESC LIMIT ${limit}`
    );
    return result.records;
  }

  static async getAccountById(id) {
    const conn = await getConnection();
    return conn.sobject('Account').retrieve(id);
  }

  static async createAccount(accountData) {
    const conn = await getConnection();
    
    // Validation
    if (!accountData.Name) {
      throw new Error('Account name is required');
    }

    // Set default values for required fields if needed
    const accountWithDefaults = {
      ...accountData,
      BillingStreet: accountData.BillingStreet || '',
      BillingCity: accountData.BillingCity || '',
      BillingState: accountData.BillingState || '',
      BillingPostalCode: accountData.BillingPostalCode || '',
      BillingCountry: accountData.BillingCountry || ''
    };

    return conn.sobject('Account').create(accountWithDefaults);
  }

  static async updateAccount(id, updateData) {
    const conn = await getConnection();
    return conn.sobject('Account').update({ 
      Id: id, 
      ...updateData 
    });
  }

  static async deleteAccount(id) {
    const conn = await getConnection();
    return conn.sobject('Account').destroy(id);
  }

  static async searchAccounts(searchTerm) {
    const conn = await getConnection();
    const result = await conn.query(
      `SELECT Id, Name FROM Account 
       WHERE Name LIKE '%${searchTerm}%' 
       OR Phone LIKE '%${searchTerm}%'
       LIMIT 10`
    );
    return result.records;
  }
}

module.exports = AccountService;