class QueryController < ApplicationController

  before_filter :variables

  def variables

    @prefix = {"owl" => "http://www.w3.org/2002/07/owl#",
              "rdfs" => "http://www.w3.org/2000/01/rdf-schema",
              "rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
              "foaf" => "http://xmlns.com/foaf/0.1/",
              "it" => "http://itech.ugent.be/ontology/17/",
              "dces" => "http://purl.org/dc/elements/1.1/"}
  end

  # GET /query
  #   query filters include but are not limited to:
  #     type, description, title, subject, type, coverage, date, creator
  #   query filters can be literals or URIs, in which case they have to be
  #   enclosed in <brackets>
  def index
    @query = String.new

    # Add possible prefixes
    @prefix.each do |key, value|
      @query << " PREFIX " + key + ":<" + value + ">"
    end

    # Start of query
    #
    # Note: this query assumes OWL is used. When using RDFS, replace the
    # first statement by:
    #
    # `?image a ?type. ?type rdfs:subClassOf* foaf:Image. `
    #
    @query << " SELECT * WHERE { " \
          + "?image a foaf:Image. " \
          + "?image ?property ?value. "

    # Search filters
    params.each do |key, value|
      case key
      when "controller", "action"
        # Ignore
      else
        if value.blank?
          # Null-values
          @query << "?image dces:#{key} ?#{key}. "
        elsif value =~ /^<.*>$/
          # Filter for URIs
          @query << "?image dces:#{key} #{value}. "
        elsif value =~ /^[0-9]*$/
          # Filter for integers
          @query << "?image dces:#{key} ?#{value}. "
        else
          # Filter for literals
          @query << "?image dces:#{key} ?#{key}. FILTER regex(?#{key}, \x22#{value}\x22, 'i'). "
        end
      end
    end

    # End of query
    @query << " }"

    # Use a temporary hashmap to prevent duplicates
    hash = Hash.new

    begin
      Rails.application.config.sparql.query(@query).each do |result|
        # Resource URI
        uri = result[:image].to_s

        # Create a new result entry an populate it
        hash[uri] || hash[uri] = Hash.new
        hash[uri]["uri"] = uri

        # Extract only DC terms
        property = result[:property].to_s
        if property.starts_with?("http://purl.org/dc/")
          hash[uri][property.split('/').last] = result[:value].to_s
        end

        result.each_binding do |name, value|
        end
      end
    rescue SPARQL::Client::MalformedQuery
      render :status => :bad_request, :text => "Invalid parameter"
    end

    @result = hash.values
  end

end
