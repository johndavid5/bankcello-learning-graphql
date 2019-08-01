# From 1st curl example in Chapter 3
set -x
curl 'http://snowtooth.herokuapp.com/' -H 'Content-Type: application/json' --data '{"query":"{ allLifts {name }}"}'
set +x
