docker image rm

docker container stop $(docker container ls -aq)
docker container rm $(docker container ls -aq)

docker image prune -a

sudo rm -rf dist
sudo rm -rf node_modules
