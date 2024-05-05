# Excel Upload App


This web application allows users to upload Excel files (.xlsx, .csv) to a MongoDB database. It utilizes Node.js, Express, Multer, XLSX, and MongoDB for the backend, and EJS for server-side templating. The application provides a simple interface for users to select an Excel file, which is then processed and its data stored in a MongoDB database.
## Setup

Clone the repository:
```bash
git clone https://github.com/KPkm25/excel-to-mongodb
cd excel-to-mongodb
```
Install dependencies:
```bash
npm install
```

Create a .env file in the root directory and set your MongoDB connection URI:
```bash
MONGO_URI=your_mongo_db_connection_uri
PORT=3000
```
Start the server:
```bash
npm run test
```
The server will run on 
```bash
http://localhost:3000.
```
## Usage

Access the application in your browser at http://localhost:3000/.

On the homepage, click "Choose File" to select an Excel file (.xlsx or .csv).

Click "Upload" to upload the file. After successful upload, you'll be redirected to a success page.

To view the uploaded data, check your MongoDB database with the specified dbName and collection name (which is derived from the uploaded file's name).
## Dependencies
```
Express: Web framework for Node.js.
```
```
Multer: Middleware for handling multipart/form-data, primarily used for file uploads.
```
```
XLSX: Library for reading Excel files.
```
```
MongoDB: Official MongoDB driver for Node.js.
```
```
dotenv: Module for loading environment variables from a .env file.
```