# neexa-assignment

## backend

Here’s a simple documentation template for running your backend project. Tailor it to match your specific project setup and requirements.

---

# **Backend Setup and Running Instructions**

### **Prerequisites**

Ensure the following are installed on your system:

1. [Node.js](https://nodejs.org/) (Recommended: LTS version)
2. [Composer](https://getcomposer.org/)
3. PHP (Minimum version: PHP 8.1, recommended for Laravel 11)
4. A database system (e.g., MySQL, PostgreSQL)
5. [Git](https://git-scm.com/)

---

### **Steps to Set Up and Run the Backend**

1.  **Clone the Repository**
    Open your terminal and run:

    ```bash
    git clone https://github.com/kmarv/neexa-assignment.git
    cd backend
    ```

2.  **Install Dependencies**

    - **PHP Dependencies**:
      ```bash
      composer install
      ```
    - **Node.js Dependencies** (if applicable, e.g., for front-end assets):
      ```bash
      npm install
      ```

3.  **Set Up Environment Variables**
    Copy the `.env.example` file to create a `.env` file:

    ```bash
    cp .env.example .env
    ```

    Open the `.env` file in a text editor and configure the following:

    - **Database Configuration**:
      ```env
      DB_CONNECTION=mysql
      DB_HOST=127.0.0.1
      DB_PORT=3306
      DB_DATABASE=your_database_name
      DB_USERNAME=your_database_username
      DB_PASSWORD=your_database_password

      MAIL_MAILER=smtp
      MAIL_HOST=sandbox.smtp.mailtrap.io
      MAIL_PORT=2525
      MAIL_USERNAME=ed50e649d535cf
      MAIL_PASSWORD=3d1132bf07cee1
      MAIL_ENCRYPTION=ssl
      MAIL_FROM_ADDRESS="marvkaay@gmail.com"
      MAIL_FROM_NAME="${APP_NAME}"

           ```

    - **Other Configuration** (e.g., APP_NAME, APP_URL).

4.  **Generate Application Key**
    Run the following to generate a unique application key:

    ```bash
    php artisan key:generate
    ```

5.  **Run Migrations and Seeders**
    Migrate the database and seed any required data:

    ```bash
    php artisan migrate --seed
    ```

6.  **Run the Server**
    Start the Laravel development server:

    ```bash
    php artisan serve
    ```

    By default, the server will run at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

### ** Run the queue**

If your project includes tests, run them with:

```bash
php artisan queue:work
```

---

### ** To run the job**

if you want to run the job for mark overdue follows
copy the link below and run it in your browser

```bash
http://127.0.0.1:8000/run-missed-followups-job
```

### **End**

## **frontend **
Here’s a simple documentation to set up and run a React app.

---

# **React App Setup and Running Instructions**

### **Prerequisites**
Ensure you have the following installed:
1. [Node.js](https://nodejs.org/) (Recommended: LTS version)
2. [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (npm is bundled with Node.js)

---

### **Steps to Set Up and Run the React App**

1. **Clone the Repository**
   Open your terminal and clone the project:
   ```bash
   git clone https://github.com/kmarv/neexa-assignment.git
   cd frontend
   ```

2. **Install Dependencies**
   Install all necessary dependencies:
   ```bash
   npm install
   ```
   or if you're using Yarn:
   ```bash
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file to include the API base URL and other configurations:
   ```env
   REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. **Run the Development Server**
   Start the development server:
   ```bash
   npm start
   ```
   or with Yarn:
   ```bash
   yarn start
   ```

   The app will run by default at [http://localhost:3000](http://localhost:3000).

---

### **Optional: Build for Production**
To build the app for production:
```bash
npm run build
```
or with Yarn:
```bash
yarn build
```
The production-ready files will be located in the `build` folder.




### **Troubleshooting**
- If the app fails to connect to the backend API, ensure the `REACT_APP_API_BASE_URL` in `.env` matches the backend's URL.
- If there are dependency errors:
  1. Delete `node_modules` and `package-lock.json`:
     ```bash
     rm -rf node_modules package-lock.json
     ```
  2. Reinstall the dependencies:
     ```bash
     npm install
     ```

---

### **End**
