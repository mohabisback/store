
# set env variables to that default enviroment
aws s3 setenv `cat .env | sed '/^#/ d' | sed '/^$/ d'`