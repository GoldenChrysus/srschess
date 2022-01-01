#!/bin/bash
set -e

# Then exec the container's main process (what's set as CMD in the Dockerfile).
source /etc/profile
service nginx start
RAILS_ENV=production rake db:migrate
RAILS_ENV=production rake db:seed
RAILS_ENV=production rails s -d -b 0.0.0.0 -p 3000
sleep infinity