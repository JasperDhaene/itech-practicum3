class QueryController < ApplicationController

  before_filter :variables

  def variables

    @prefix = {"owl" => "http://www.w3.org/2002/07/owl#",
              "rdfs" => "http://www.w3.org/2000/01/rdf-schema",
              "rdf" => "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
              "foaf" => "http://xmlns.com/foaf/0.1/",
              "it" => "http://itech.ugent.be/ontology/17/",
              "dc" => "http://purl.org/dc/terms/"}

    # Default values
    @offset = 0
    @limit = 9001
  end

  # GET /query
  #   result parameters:
  #     limit - limit returned results
  #     offset - offset returned results (use with limit)
  #     operator - possible values: 'or', 'and'
  #   query parameters include but are not limited to:
  #     theme - possible values: 'people', 'animals', 'architecture', 'nature', 'politics', 'humor', 'culture', 'news'
  #     description
  #     title
  #     subject
  #     type
  #     coverage
  #     date
  #     creator
  def index
    # Result parameters
    limit = params[:limit] ? params[:limit] : @limit
    offset = params[:offset] ? params[:offset] : @offset
    if params[:operator] == 'OR' || params[:operator] == 'AND'
      operator = params[:operator]
    else
      render :status => :bad_request, :text => "Value of parameter 'operator' not allowed"
    end

    @query = String.new

    @prefix.each do |key, value|
      @query << " PREFIX " + key + ":<" + value + ">"
    end

    # Start of query
    @query << " SELECT * WHERE { " \
          + "?image a ?type. ?type rdfs:subClassOf* foaf:Image. " \
          + "?image ?property ?value. "

    # Search parameters
    if params[:theme]
      @query << "?image dc:type " \
                  + "<http://dbpedia.org/resource/Category:" \
                  + params[:theme].capitalize \
                  + ">. "
    end

    # End of query
    @query << " } LIMIT #{limit}" \
          + " OFFSET #{offset}"

    # Use a temporary hashmap to prevent duplicates
    hash = Hash.new

    Rails.application.config.sparql.query(@query).each do |result|
      # Resource URI
      uri = result[:image].to_s

      hash[uri] || hash[uri] = Hash.new
      hash[uri]["uri"] = uri

      property = result[:property].to_s

      # Extract only DC terms
      if property.starts_with?("http://purl.org/dc/")
        hash[uri][property.split('/').last] = result[:value].to_s
      end

      result.each_binding do |name, value|
      end
    end

    @result = hash.values
  end

end
