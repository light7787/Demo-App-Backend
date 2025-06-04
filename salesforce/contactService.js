const { getConnection } = require('./connection');

class ContactService {
  static async getContacts(limit = 5) {
    const conn = await getConnection();
    const result = await conn.query(
      `SELECT Id, FirstName, LastName, Email, Phone FROM Contact LIMIT ${limit}`
    );
    return result.records;
  }

  static async getContactById(id) {
    const conn = await getConnection();
    return conn.sobject('Contact').retrieve(id);
  }

  static async createContact(contactData) {
    const conn = await getConnection();
    return conn.sobject('Contact').create(contactData);
  }

  static async updateContact(id, updateData) {
    const conn = await getConnection();
    return conn.sobject('Contact').update({ Id: id, ...updateData });
  }

  static async deleteContact(id) {
    const conn = await getConnection();
    return conn.sobject('Contact').destroy(id);
  }
}

module.exports = ContactService;