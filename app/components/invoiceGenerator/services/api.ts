import axios from 'axios';
import {Invoice} from '../types/invoice';

// Define the API service base URL for invoices
const INVOICE_API_BASE_URL = process.env.NEXT_PUBLIC_INVOICE_API_URL || 'http://localhost:8080/api/invoices';

export const apiService = axios.create({
  baseURL: INVOICE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface SaveInvoiceResponse {
  invoice: Invoice;
  stripeInvoiceUrl: string;
}

export const saveInvoice = async (invoiceData: Invoice): Promise<SaveInvoiceResponse> => {
  try {
    // Simulate API call for saving/updating an invoice
    // In a real application, you would send invoiceData to your backend
    // and the backend would interact with Stripe.
    console.log("Attempting to save invoice:", invoiceData);

    let response;
    if (invoiceData.id && invoiceData.invoiceNumber) {
      // Assume update if invoice has an ID and number
      response = await apiService.put(`/${invoiceData.id}`, invoiceData);
    } else {
      // Assume create new invoice
      response = await apiService.post('/', invoiceData);
    }

    // Simulate Stripe URL generation
    const simulatedStripeUrl = `https://stripe.com/invoice/${response.data.id || 'mock-invoice-id'}`;

    return {
      invoice: response.data as Invoice,
      stripeInvoiceUrl: simulatedStripeUrl,
    };
  } catch (error) {
    console.error("Error in saveInvoice API call:", error);
    throw new Error("Failed to save invoice via API.");
  }
};

// You can add other invoice-related API calls here (e.g., getInvoice, deleteInvoice)
