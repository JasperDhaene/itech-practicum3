# Internet Technologie: Practicum Semantisch Web

Authors: **Jasper D'haene**, **Florian Dejonckheere**

## Installation

### Local

Run the following commands:
```
$ export RAILS_ENV=development
$ bundle install [ --path vendor/bundle ]
$ rails server [ -p 3000 ]
```

### Docker

If you use Docker, first build the image:
```
$ docker -t floriand/semanticsearch .
```

Then run it:
```
$ docker run -d --name semanticsearch -p 127.0.0.1:3000:3000 floriand/semanticsearch
```

The Rails server is now running on http://localhost:3000/.
