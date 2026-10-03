import api from './api';

/**
 * inquiryService handles booking inquiries and general contact messages.
 * Contact messages are posted without a pgId and surface in the admin inbox.
 */
const inquiryService = {
  submitContact: async (contactData) => {
    try {
      const response = await api.post('/inquiries', contactData);
      return response.data;
    } catch (error) {
      console.warn('Submit Contact API failed:', error.message);
      const serverMessage = error.response?.data?.error;
      throw new Error(serverMessage || 'Server unavailable. Please try again later.');
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/inquiries');
      return response.data;
    } catch (error) {
      console.warn('Fetch Inquiries API failed:', error.message);
      throw new Error('Server unavailable. Please try again later.');
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/inquiries/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.warn('Update Inquiry Status API failed:', error.message);
      throw new Error('Server unavailable. Please try again later.');
    }
  },
};

export default inquiryService;
