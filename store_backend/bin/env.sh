# set elastic beanstalk default enviroment to $1
eb use $1
# set env variables to that default enviroment
eb setenv $STORE_BACKEND_VARIABLES