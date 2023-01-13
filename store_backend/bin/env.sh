# set elastic beanstalk default enviroment to $1
eb use $1
# set env variables to that default enviroment
eb setenv `cat .env | sed '/^#/ d' | sed '/^$/ d'`