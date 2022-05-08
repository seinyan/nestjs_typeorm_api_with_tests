docker image rm

docker container stop $(docker container ls -aq)
docker container rm $(docker container ls -aq)

docker image prune -a

sudo rm -rf dist
sudo rm -rf node_modules
sudo rm -rf pg_data
sudo rm -rf rabbitmq_d
sudo rm -rf redis
