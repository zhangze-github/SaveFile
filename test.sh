##!/bin/bash
#
#prog="forever"
#USER="tomcat"
#export PATH=/usr/local/bin:/home/q/node/bin:$PATH
#
#start() {
#echo -n $"Starting $prog: "
##exec /bin/su $USER -c "NODE_ENV=betab forever start -s /home/q/www/superstar/webapp/bin/start -l /home/q/www/superstar/logs"
#exec /bin/su $USER -c "NODE_ENV=betad NODE_PATH=/home/q/www/superstar/snail_node/node_modules forever start -s /home/q/www/superstar/snail_node/bin/start -l /home/q/www/superstar/logs"
#
#if [[ $? -eq 0 ]]; then
#return 0
#else
#return 1
#fi
#}
#
#stop() {
#echo -n $"Stopping $prog: "
#huixian=$(ps aux|grep 'node /home/q/www/superstar/snail_node/bin/start' | grep -v grep)
#if [ -n "$huixian" ]; then
#exec /bin/su $USER -c "forever stop /home/q/www/superstar/snail_node/bin/start"
#fi
#
#if [[ $? -eq 0 ]]; then
#return 0
#else
#return 1
#fi
#}
#
#case "$1" in
#start)
#start && exit 0
#;;
#stop)
#stop || exit 0
#;;
#*)
#echo $"Usage: $0 {start|stop}"
#exit 2
#esac
#exit $?










#!/bin/bash
echo '----------执行 git pull----------'
git pull
echo '----------执行 git status----------'
git status
echo '----------执行 git add .----------'
git add .
echo '----------执行 git commit -m ' $1 '----------'
git commit -m $1
echo '----------执行 git push----------'
git push


























