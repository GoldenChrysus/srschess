#!/usr/bin/env bash
cp {.env,.env.development,.env.test,.env.production} ../api/
cp {.env,.env.development,.env.test,.env.production} ../front/
cp *.json ../api/config/