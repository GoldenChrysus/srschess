### STAGE 1: Build React app
FROM node:14.18.1 AS build-front
RUN mkdir /front
WORKDIR /front
COPY ./front /front
RUN npm i
RUN npm run build

### STAGE 2: launch
FROM ubuntu AS start-server

# Prereqs
RUN apt-get update
RUN apt-get install -y openssl curl nginx libpq-dev

# Install Ruby
RUN \curl -L https://get.rvm.io | bash -s stable
RUN /bin/bash -l -c "rvm requirements"
RUN /bin/bash -l -c "rvm install 3.0.0"
RUN /bin/bash -l -c "gem install bundler"
RUN /bin/bash -l -c "gem install rails"
RUN echo '[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"' >> ~/.bashrc
RUN /bin/bash -l -c "source ~/.bashrc"

# Copy previous build steps
COPY --from=build-front /front/build /usr/share/nginx/html

# Setup nginx
COPY ./config/nginx /etc/nginx/conf.d
RUN rm /etc/nginx/sites-enabled/default
EXPOSE 80
VOLUME /usr/share/nginx/html
VOLUME /etc/nginx

# Launch Rails
RUN mkdir /api
WORKDIR /api
COPY ./api /api
RUN /bin/bash -l -c "bundle install"
RUN rm -f tmp/pids/server.pid

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]