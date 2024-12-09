import express from 'express';
import connectDB from './config/database';
import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import referenceRoutes from './routes/reference.route'
import categoryRoutes from './routes/category.route'
import machineRoutes from './routes/machine.route'
import brandRoutes from './routes/brand.route'
import searchRoutes from './routes/search.route'
import clientMachineRoutes from './routes/clientMachine.route';

import dotenv from 'dotenv';
import cors from 'cors'; // Importa cors
import { setupSwaggerDocs } from './config/swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Cambia '50mb' según tus necesidades
app.use(express.urlencoded({ limit: '50mb', extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/reference', referenceRoutes)
app.use('/api/category', categoryRoutes);
app.use('/api/machine', machineRoutes);
app.use('/api/brand', brandRoutes);
app.use('/search/', searchRoutes);
app.use('/api/clientMachine', clientMachineRoutes);
app.use('/',(req,res)=>{res.status(200).json({message:'Welcome to the API'})})


//If no route is matched by now, it must be a 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found 404' });
});

// Configurar Swagger
setupSwaggerDocs(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
