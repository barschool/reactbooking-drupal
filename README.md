# reactbooking-drupal - EBS Booking flow using react for a drupal 8 site

## Drupal Installation

The Docker setup is mostly borrowed from here: https://circleci.com/blog/continuous-drupal-p1-maintaining-with-docker-git-composer/

Databases to initialise the project can be found [here](https://www.dropbox.com/sh/7lvdvn8u7ajrrjm/AADpR7zmQgIZzoKicNAInqFWa?dl=0 "Dropbox") and should be placed in /db

#### Clone this repository
```https://github.com/barschool/reactbooking-drupal.git```

#### Build and start containers
```
cd reactbooking-drupal
docker-compose up -d --build
```

#### Login to the web container
```root@5d5b28296d33:/app# docker exec -it d8-web bash```

#### Set permissions on /app/web
```root@5d5b28296d33:/app# chown -R www-data:www-data /app/web```

#### Install drupal and dependencies
```root@5d5b28296d33:/app# composer create-project drupal-composer/drupal-project:8.x-dev /app --stability dev --no-interaction```

#### Import config (?) 
(not sure if/where in the process this needs to be done as i've not rebuilt the containers from scratch yet)
```root@5d5b28296d33:/app# drush config-import```

#### Clear cache
```root@5d5b28296d33:/app# drush cr```
```root@5d5b28296d33:/app# exit```

You should now be able to load the site on localhost:8080

username: admin
password: mypassword

## Theme build system installation
These commands should not be run inside the docker web container but in a terminal on localhost

```
cd app/web/themes/react_booking
npm install -g parcel-bundler
npm install
npm start
```

Make sure port 3000 is free for HMR to work (hot module replacement). Only javascript is working with HMR as of now, the parcel team is working on css. 


## Demo
![alt text](https://www.dropbox.com/s/aaiqnjkjwih02wq/react-booking.gif?raw=1)


