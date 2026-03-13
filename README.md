LIVE URL
https://client-management-portal-production.up.railway.app/clients

GITHUB REPO
https://github.com/Carinan02/client-management-portal


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

FREE PRODUCTION PLATFORM - 
https://railway.com/
 - because it is easy to use and complete with mysql already, some free hosting dont have mysql
 - NOTE! BECAUSE IT IS FREE, MIGHT SLEEP FOR FEW MINS

 WORKER SETUP IN RAILWAY
1. Create worker.sh in project root with the queue work command
2. Commit and push to GitHub
3. Go to Railway →  project dashboard
4. Click "New Service" → select "Empty Service"
5. Go to the new service's Settings → find "Start Command" 
6. connect to same repo and branch Select the same repo as your main app
7. Replace the start command with the queue worker command
8. Go to Variables tab of the new worker service
9. Copy all the same env variables from  main app service into the worker service
10. Deploy the worker service 

AI TOOLS USED 
https://claude.ai/
https://chatgpt.com/

https://claude.ai/share/be6b95f2-1226-4caf-858f-fad7987afc59
https://claude.ai/share/c8453f84-ecc6-4bc6-b1ce-5efb8f161b51
https://chatgpt.com/share/69b400ec-c954-800e-a481-58a9d4a4e585
https://chatgpt.com/share/69b4011c-d670-800e-b5eb-0d08a5785b9e
https://chatgpt.com/share/69b401c3-ca04-800e-8883-2ce2ed2ef2e7
https://chatgpt.com/share/69b40235-7c08-800e-b8b7-1750d047ec15