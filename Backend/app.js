require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const errorController = require('./controllers/error');

const app = express();

//View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

//Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Routes
const employeeRoutes = require('./routes/employee');
const clientRoutes = require('./routes/client');
const outInvoiceRoutes = require('./routes/outInvoice');
const incInvoiceRoutes = require('./routes/incInvoice');
const vehicleRoutes = require('./routes/vehicle/index');
const inspectionRoutes = require('./routes/inspection');
const payslipRoutes = require('./routes/payslip');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const indexRoutes = require('./routes/index');

app.use('/employee', employeeRoutes);
app.use('/client', clientRoutes);
app.use('/outInvoice', outInvoiceRoutes);
app.use('/incInvoice', incInvoiceRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/inspection', inspectionRoutes);
app.use('/payslip', payslipRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use(indexRoutes);
app.use(errorController.get404);


const server = app.listen(5000, () => {
  console.log('Server started on port 5000');
});

// Proper shutdown handler
const { sql } = require('./util/db');
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  server.close(async () => {
    try {
      await sql.close();
      console.log('SQL connection closed.');
    } catch (e) {
      console.log('Error closing SQL connection:', e.message);
    }
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
});

// Export Express aplikacije za testove
module.exports = app;