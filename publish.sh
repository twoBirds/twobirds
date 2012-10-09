#!/bin/sh
# Commit all to git & push to github & publish npm
# parameters: message version

cd /home/twobirds

# no message given?
if [ -z $1 ]
then
	read -p "message: " msg
else
	msg="$1"
	echo "message: $msg"
fi

# get old version
old_version=`cat ./package.json | grep "version" | sed 's/"version": //g;s/" \w,\n\r\t//g'`
echo "old version: $old_version"

# no version given?
if [ -z $2 ]
then
	read -p "new version: " new_version
else
	new_version="$2"
	echo "new version: $new_version"
fi
replace $old_version $new_version -- ./package.json
cat ./package.json | grep "vers"

#commit changes
echo "\n==> COMMIT CHANGES <==" 
git add .
git commit -a -m "$msg"

#upload to github
echo "\n==> PUSH TO GITHUB <==" 
git push git@github.com:FrankieTh/twobirds.git < gitpwd.txt

#npm publish
echo "\n==> NPM PUBLISH <==" 
npm publish
