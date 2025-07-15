
import express from 'express';
import doctor from './doctor/doctor.router';
import appointment from './appointment/appointment.router';
import payment from './payment/payment.router';
import prescription from './prescription/prescription.router';
import complaint from './complaint/complaint.router';
import user from './user/user.router';
import cors from 'cors'
import contact from './contact/contact.router';


const initializeApp = ()=>{
const app = express();

//middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

//routes
user(app);
doctor(app);
appointment(app);
payment(app);
prescription(app);
complaint(app);
contact(app)
app.get('/', (req, res) => {
    res.send('Welcome to the Hospital API');
}
)
return app

}
const app = initializeApp()
export default app


