const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const uri = 'mongodb+srv://rrkrish123:rrkrish123@graphifycluster.irmpn.mongodb.net/?retryWrites=true&w=majority&appName=Graphifycluster';

mongoose
  .connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  const mySchema = new mongoose.Schema({
    invoice_number: String,
    recipient_name: String,
    phone_number: String,
    address: String,
    codelist: String,
    adlist: String,
    totalamount: String,
    advance_paid: String,
    balance_amount: String,
  });

    const myModel = mongoose.model('Graphify_Invoice_History', mySchema);

    app.get('/invoices', async (req, res) => {
      const invoices = await myModel.find();
      res.json(invoices);
    });

    app.post('/api/invoices', async (req, res) => {
        const {invoice_number, recipient_name, phone_number, address,codelist,adlist, totalamount, advance_paid, balance_amount } = req.body; 

        try {
            const invoice = new myModel({
                invoice_number: invoice_number,
                recipient_name: recipient_name,
                phone_number: phone_number,
                address: address,
                codelist: codelist,
                adlist: adlist,
                totalamount: totalamount,
                advance_paid: advance_paid,
                balance_amount: balance_amount,
              });
          await invoice.save();
          res.json(invoice);
        } catch (error) {
          console.error("Error saving invoice:", error);
          res.status(500).json({ error: "Failed to save invoice" });
        }
      });

      app.post("/invoices/delete-invoice", async(req, res) => {
        try {
          const { invoice_number } = req.body;
          await myModel.deleteOne({ invoice_number: invoice_number });
          res.json({ message: "Invoice deleted successfully"});
          
        } catch (error) {
          console.error("Error deleting invoice:", error);
          res.status(500).json({ error: "Failed to delete invoice" });
          
        }
      });

    app.post("/invoices/update-invoice", async (req, res) => {
      try {
        const { invoice_number, balance_amount } = req.body;
    
        if (!invoice_number || balance_amount === undefined) {
          return res.status(400).json({ error: "Invoice number and balance amount are required." });
        }
    
        const result = await myModel.updateOne(
          { invoice_number: invoice_number },
          { $set: { balance_amount: balance_amount } }
        );
    
        if (result.modifiedCount > 0) {
          res.json({ message: "Balance updated successfully" });
        } else {
          res.status(404).json({ error: "Invoice not found" });
        }
      } catch (error) {
        console.error("Error updating invoice balance:", error);
        res.status(500).json({ error: "Failed to update invoice balance" });
      }
    });
    

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
