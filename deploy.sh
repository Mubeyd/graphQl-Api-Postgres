#!/bin/bash

# docker-compose up -d --force-recreate (run this in case of error)


echo "Pulling"
git pull

echo "Building application"
docker-compose up -d --build


# if there is no space in ec2 instance run this command
# sudo docker system prune -a --volumes --force or sudo docker system prune -a 
# then check the space with df -h
