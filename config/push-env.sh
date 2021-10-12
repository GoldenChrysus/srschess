#!/usr/bin/env bash
cp .env ../api/.env
cp .env.development ../api/.env.development
cp .env.test ../api/.env.test
cp .env.production ../api/.env.production

cp .env ../front/.env
cp .env.development ../front/.env.development
cp .env.test ../front/.env.test
cp .env.production ../front/.env.production