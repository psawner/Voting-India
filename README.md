# Voting India

Voting India is web application that allows users to create their account and cast your vote to the specific candidate.

## Features
- admin and voter based role only
- User registration & login with JWT authentication
- Secure password hashing with bcrypt
- Voting system with MySQL database
- Email notifications with Nodemailer
- candidates data 
- casting votes
- admin panel
- voting status 
- Vote once per user.
- Real-time vote count updates.
- Responsive UI for mobile and desktop.

## License 
- This project is licensed under the MIT license

### **Installation**
- Clone the repository → git clone https://github.com/psawner/Voting-India.git
cd Voting-India

## Set up the backend →
cd backend
npm install bcrypt cors dotenv express jsonwebtoken mysql2 nodemailer
npm start

## Database Setup
Run the following to create the database structure:
```bash
mysql -u root -p < schema.sql
```

## Configure Environment Variables
Create a .env file in the root folder
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=voting_app
JWT_SECRET=yourjwtsecret
EMAIL_USER=youremail@example.com
EMAIL_PASS=youremailpassword


## Open the Frontend
just Just open index.html in your browser, or serve it with a live server.
Make sure your frontend API calls point to http://localhost:3000.


## screeshots

### Login and Registration Pages
![Login Page](https://github.com/psawner/Voting-India/blob/main/screenshots/login.png)

![Registration Page](https://github.com/psawner/Voting-India/blob/main/screenshots/registration.png)

### Dashboard Page
![Dashboard Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard.png)
![Dashboard1 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard1.png)
![Dashboard2 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard2.png)
![Dashboard3 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard3.png)
![Dashboard4 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard4.png)
![Dashboard5 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard5.png)
![Dashboard6 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard6.png)
![Dashboard7 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard7.png)
![Dashboard8 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/dashboard8.png)

![AdminDashboard Page](https://github.com/psawner/Voting-India/blob/main/screenshots/adminDashboard.png)
![AdminDashboard1 Page](https://github.com/psawner/Voting-India/blob/main/screenshots/admindashboard1.png)

### security
![Security](https://github.com/psawner/Voting-India/blob/main/screenshots/security.png)




