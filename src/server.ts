// import app from "./index";



//   app.listen(8081, () => {
//     console.log('Server is running on http://localhost:8081');
//   })

import app from "./index";
import dotenv from 'dotenv/config';


const PORT =8080;
app.listen(PORT, () => {

    console.log(`Server is running on port http://localhost:${PORT}`);
}) 
