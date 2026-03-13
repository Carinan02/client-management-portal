


README Requirements
Document the following in your README.md:
• Which platform you deployed to and why.
• Any deployment-specific configuration or steps taken (e.g., Procfile, render.yaml,
Dockerfile if used).
• How the queue worker is kept running in production (e.g., a worker process/dyno).

README.md with local setup steps and test credentials for each role


• Set QUEUE_CONNECTION=database in .env
• Run php artisan queue:table && php artisan migrate to set up the jobs table
• Start the worker with php artisan queue:work

#DEV
#LOCAL SETUP
XAMPP -  DATABASE HOSTING ( change apache port to 8080)
LARAVEL HERD - PHP and nginx PHP 8.4.16
Composer version 2.9.5 2026-01-29 11:40:53
Laravel Installer 5.24.6

TEST USER CREDENTIALS
ADMIN
EMAIL: - admin@example.com 
PASSWORD: password

MANAGER
EMAIL: - manager@example.com 
PASSWORD: password

STAFF
EMAIL: - staff@example.com 
PASSWORD: password

admin
RUN XAMPP
http://localhost:8080/phpmyadmin/


php artisan migrate - run migration
php artisan db:seed - run seeders

# .env
QUEUE_CONNECTION=database

# One-time setup
php artisan queue:table
php artisan migrate

# DEV Must be running for imports to process
php artisan queue:work

#creates a jop folder 
php artisan make:job ProcessClientImport

FREE PRODUCTION PLATFORM
https://railway.com/
 - because it is easy to use and complete with mysql already, some free hosting dont have mysql