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
    git clone <repository-url>
    cd <repository-folder>
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
