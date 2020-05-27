all: css templates

# Prepare a SASS installation, this should allow any system to build the assets
# for this project on it's own.
install-sass:
	cd sass && make install
	cd sass && make clean

# Generate the CSS assets for the project
# This uses dart sass, because ruby is apparently terribly out.
css: 
	test -f ./sass/sass || make install-sass
	./sass/sass assets/scss:assets/css --source-map

templates:
	cd assets/templates && php build.php

remove:
	-rm -R assets/css
	cd sass && make remove
	cd assets/templates && rm en/*.html
	cd assets/templates && rm de/*.html