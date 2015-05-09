require 'sparql/client'

Rails.application.config.sparql = SPARQL::Client.new(Rails.application.config.sparql_uri)
