#!/bin/bash

rake db:migrate RAILS_ENV=development
rails server -b 0.0.0.0 -e development
