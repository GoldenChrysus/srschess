### STAGE 1: Build React app
FROM node:14.18.1 AS build-front
RUN mkdir /front
WORKDIR /front
COPY ./front /front
RUN npm i
RUN npm run build

### STAGE 2: launch
FROM debian:11.1 AS start-server

# Get rid of sh
SHELL ["/bin/bash", "-l", "-c"]

# Prereqs
RUN apt-get update
RUN apt-get install -y openssl curl nginx libpq-dev procps systemd python3 python3-pip gnupg

# Copy previous build steps
COPY --from=build-front /front/build /usr/share/nginx/html

# Setup nginx
COPY ./config/nginx /etc/nginx
RUN rm /etc/nginx/sites-enabled/default
EXPOSE 80
VOLUME /usr/share/nginx/html
VOLUME /etc/nginx
RUN systemctl enable nginx

# Setup Python
RUN pip install psycopg2-binary
RUN pip install chess==1.7.0
RUN pip install python-dotenv

# Install Ruby
RUN gpg --keyserver keys.openpgp.org --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
RUN \curl -L https://get.rvm.io | bash -s stable
RUN source /etc/profile.d/rvm.sh
RUN echo 'export PATH="$PATH:/usr/local/rvm/bin"' >> ~/.bashrc
RUN source ~/.bashrc
RUN source /etc/profile
RUN rvm requirements
RUN rvm install 3.0.0
RUN gem install bundler
RUN gem install rails

# Launch Rails
RUN mkdir /api
WORKDIR /api
COPY ./api /api
RUN bundle install
RUN rm -f tmp/pids/server.pid

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]