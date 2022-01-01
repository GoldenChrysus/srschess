#!/usr/bin/env bash
cp config/{.env,.env.development,.env.test,.env.production} api/
cp config/{.env,.env.development,.env.test,.env.production} front/
cp config/{*.json,*.key} api/config/