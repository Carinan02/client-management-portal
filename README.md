


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

php artisan migrate
MODIFY USERS add column role
php artisan make:migration add_role_to_users_table --table=users
$table->boolean('is_active')->default(true)->after('role');
create seeder
php artisan make:seeder UserSeeder

php artisan db:seed --class=UserSeeder

php artisan make:policy UserPolicy --model=User

php artisan make:middleware RoleMiddleware

# .env
QUEUE_CONNECTION=database

# One-time setup
php artisan queue:table
php artisan migrate

# Must be running for imports to process
php artisan queue:work

#creates a jop folder 
php artisan make:job ProcessClientImport