API_client_test_delploy
=======================

Deploy tool for [sudodoki/api_client_test](https://github.com/sudodoki/api_client_test).

Server
======

Sample setup that is confirmed to work with the app
0) Ubuntu 14.04
1) Nginx (nginx/1.4.6)
2) Mongo (~2.4.9)
3) Node (v0.12.0)

Extra steps
===========

Need to have deploy user on the OS.
Need to add /etc/init/deploy folder writable for deploy
Need to grant deploy user ability to write to /etc/nginx/sites-enabled