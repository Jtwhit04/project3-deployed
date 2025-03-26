# project3-team30
Web-based POS system using React.js, JavaScript, Flask, Python, and Postgres

# Setup
1. Make sure you have Node.js and Python installed.
2. Clone the repository and cd into it.
3. In root directory, run `pip install -r requirements.txt` to install the necessary Python dependencies.
4. `cd` into front-end, then run `npm install` to install the necessary React dependencies.
5. `cd` into back-end, and create a .env file with the following contents:
```
netid_user
netid_pass
db_pass
```
6. You're gonna need 2 terminals running, one for the frontend and one for the backend.
7. In the first terminal, `cd` into front-end and run `npm run start` to start the React frontend.
8. In the second terminal, `cd` into back-end run `python runner.py` to start the Flask backend.
9. Open your browser and go to `http://127.0.0.1:3000/` to see the app.
10. If you have problems with a typescript dependency error after running `npm run start` then try `npm install --legacy-peer-deps`