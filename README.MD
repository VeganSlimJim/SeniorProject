# Senior Project
Authors: Matthew, Cameron, Jorge, Kevin

## Building and running the Frontend:
- navigate to the frontend/my-app directory
- run: `npm install` to install the necessary dependencies (upgrade to yarn incoming)
- run: `node --max_old_space_size=8048 node_modules/@angular/cli/bin/ng serve` , to run the frontend

## Building and running the backend
- navigate to the backend directory
- run `pip3 install -r requirements.txxt` to install the necessary dependencies
- run `uvicorn app:app --port 4000 --reload` to run the backend


Just basic Modbus script to get analog values and output file with date and time as filename
