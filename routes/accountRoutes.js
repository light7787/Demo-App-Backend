const express = require('express');
const AccountService = require('../salesforce/accountService');
const router = express.Router();

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const accounts = await AccountService.getAccounts(limit);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search accounts
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search term required' });
    }
    const accounts = await AccountService.searchAccounts(q);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single account
router.get('/:id', async (req, res) => {
  try {
    const account = await AccountService.getAccountById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create account
router.post('/', async (req, res) => {
  try {
    if (!req.body.Name) {
      return res.status(400).json({ error: 'Account name is required' });
    }

    const result = await AccountService.createAccount(req.body);
    res.status(201).json({
      success: true,
      id: result.id,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Create account error:', error);
    
    if (error.errorCode === 'REQUIRED_FIELD_MISSING') {
      return res.status(400).json({ 
        error: error.message,
        fields: error.fields 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create account',
      details: error.message 
    });
  }
});

// Update account
router.put('/:id', async (req, res) => {
  try {
    const result = await AccountService.updateAccount(req.params.id, req.body);
    res.json({
      success: true,
      id: result.id,
      message: 'Account updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete account
router.delete('/:id', async (req, res) => {
  try {
    const result = await AccountService.deleteAccount(req.params.id);
    res.json({
      success: true,
      id: result.id,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;