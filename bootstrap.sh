npm install --python=python2
./node_modules/.bin/bower install
pushd public/ext_assets/bootstrap/
make bootstrap
popd

mongo blog bootstrap_db.js
