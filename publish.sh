#!/bin/sh
# Commit all to git & push to github & publish npm
# parameters: message version

cd /home/twobirds

# no message given?
if [ -z $1 ]
then
	read -p "commit message: " msg
else
	msg="$1"
fi
echo "\nmessage: $msg"

# no version given?
old_version=`cat ./package.json | grep "version" | sed 's/"version": //g;s/"//g;s/ //g;s/,//g'`
echo "\nold version: $old_version"

#change version
if [ -n $2 ]
then
	new_version="$2"
	echo "\nnew version: $new_version"
else
	read -p "\nnew version: " new_version
fi
sed -i 's/$old_version/$new_version/g' ./package.json
cat ./package.json | grep "version"

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
