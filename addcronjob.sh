#!/bin/bash

pwd=$(pwd)


crontab -l > file

echo "@reboot node $pwd/IDPS.js 3 1" >> file

crontab file